package analysis

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/danielgtaylor/huma/v2"
	flow_constants "github.com/urodstvo/moderation-service/apps/task/internal/workflows/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	"go.temporal.io/sdk/client"
)

type asyncRequest struct {
	RawBody huma.MultipartFormFiles[struct {
		Files []huma.FormFile `form:"files"`
	}]
}

type asyncResponse struct {
	Body struct {
		RequestId int      `json:"request_id"`
		Failed    []string `json:"failed,omitempty"`
	} `json:"body"`
}

func (h *handler) Async(ctx context.Context, input *asyncRequest) (*asyncResponse, error) {
	formData := input.RawBody.Data()
	if len(formData.Files) == 0 {
		return nil, huma.Error400BadRequest("Empty file")
	}

	userId := ctx.Value(constants.UserIdContextKey).(int)

	requestId, err := h.RequestService.Create(ctx, userId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create request", err)
	}

	var (
		errorFilesMu   sync.Mutex
		errorFiles     []string
		successFilesMu sync.Mutex
		successFiles   = make(map[gomodels.ContentType][]types.FileTypeParams)
		successFilesCount = 0
		wg        sync.WaitGroup
		semaphore = make(chan struct{}, 5)
	)

	for _, file := range formData.Files {
		wg.Add(1)
		file := file

		go func() {
			defer wg.Done()
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			var buf bytes.Buffer
			tee := io.TeeReader(file.File, &buf)

			_, err := io.Copy(io.Discard, tee)
			if err != nil && err != io.EOF {
				h.Logger.Error("failed to read file", "error", err, "file", file.Filename)
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			fileType, err := detectFileTypeFromReader(bytes.NewReader(buf.Bytes()), file.Filename)
			if err != nil {
				h.Logger.Error("detection failed", "error", err, "file", file.Filename)
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			uniqueFileName := generateUniqueFileName(file.Filename)

			if err := h.uploadToMinioFromBytes(ctx, buf.Bytes(), uniqueFileName); err != nil {
				h.Logger.Error("upload failed", "error", err, "file", file.Filename)
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			fileId, err := h.FileService.Create(ctx, requestId, fileType, uniqueFileName, file.Filename)
			if err != nil {
				h.Logger.Error(err.Error())
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			successFilesMu.Lock()
			successFiles[fileType] = append(successFiles[fileType], types.FileTypeParams{
				Filename:         uniqueFileName,
				OriginalFilename: file.Filename,
				Id:               fileId,
			})
			successFilesCount++
			successFilesMu.Unlock()
		}()
	}

	wg.Wait()

	workflowID := fmt.Sprintf("request-%d-%d", requestId, time.Now().UnixNano())
	
	if successFilesCount == 0 {
		h.Logger.Error("All files failed to process")
		return nil, huma.Error400BadRequest("All files failed to process: " + fmt.Sprint(errorFiles))
	}

	workflowParams := types.WorkflowParams{
		UserId:    userId,
		RequestId: requestId,
		IsAsync:   true,
		Files: struct {
			Images []types.FileTypeParams 
			Videos []types.FileTypeParams
			Audios []types.FileTypeParams
			Texts  []types.FileTypeParams
		}{
			Images: successFiles[gomodels.ContentTypeImage],
			Texts:  successFiles[gomodels.ContentTypeText],
			Audios: successFiles[gomodels.ContentTypeAudio],
			Videos: successFiles[gomodels.ContentTypeVideo],
		},
	}

	run, err := h.Temporal.ExecuteWorkflow(ctx, client.StartWorkflowOptions{
		ID:        workflowID,
		TaskQueue: flow_constants.WorkerQueueName,
	}, h.Workflow.Flow, workflowParams)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to start workflow", err)
	}

	h.RequestService.UpdateFlowData(ctx, requestId, run.GetID(), run.GetRunID())

	response := asyncResponse{}
	response.Body.RequestId = requestId
	response.Body.Failed = errorFiles

	return &response, nil
}
