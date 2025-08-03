package analysis

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	"go.temporal.io/sdk/client"
)

type syncRequest struct {
	RawBody huma.MultipartFormFiles[struct {
		Files []huma.FormFile `form:"files"`
	}]
}

type syncResponse struct {
	Body struct{} `json:"body"`
}

func (h *handler) Sync(ctx context.Context, input *syncRequest) (*syncResponse, error) {
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

			fileType, err := detectFileType(file.Filename)
			if err != nil {
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			uniqueFileName := generateUniqueFileName(file.Filename)

			if err := h.uploadToMinio(ctx, file.File, file.Size, uniqueFileName); err != nil {
				errorFilesMu.Lock()
				errorFiles = append(errorFiles, file.Filename)
				errorFilesMu.Unlock()
				return
			}

			fileId, err := h.FileService.Create(ctx, requestId, fileType, uniqueFileName, file.Filename)
			if err != nil {
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
			successFilesMu.Unlock()
		}()
	}

	wg.Wait()

	workflowID := fmt.Sprintf("request-%d-%d", requestId, time.Now().UnixNano())

	workflowParams := types.WorkflowParams{
		UserId:    userId,
		RequestId: requestId,
		IsAsync:   true,
		Files: struct {
			Images []types.FileTypeParams
			Videos []types.FileTypeParams
			Audios []types.FileTypeParams
			Texts  []types.FileTypeParams
		}{Images: successFiles[gomodels.ContentTypeImage],
			Texts:  successFiles[gomodels.ContentTypeText],
			Audios: successFiles[gomodels.ContentTypeAudio],
			Videos: successFiles[gomodels.ContentTypeVideo],
		},
	}

	run, err := h.Temporal.ExecuteWorkflow(ctx, client.StartWorkflowOptions{
		ID:        workflowID,
		TaskQueue: fmt.Sprintf("process-request-%d", requestId),
	}, h.Workflow.Flow, workflowParams)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to start workflow", err)
	}

	var result types.WorkflowResult
	if err := run.Get(ctx, &result); err != nil {
		return nil, huma.Error500InternalServerError("Workflow execution failed", err)
	}

	response := syncResponse{}

	return &response, nil
}
