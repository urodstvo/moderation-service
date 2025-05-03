package moderation_routes

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/minio/minio-go/v7"
	"github.com/urodstvo/moderation-service/libs/models/service/task"
	"github.com/urodstvo/moderation-service/libs/nats"
)

type createTasksRequest struct {
	RawBody huma.MultipartFormFiles[struct {
		Files []huma.FormFile `form:"file"`
	}]
}

type createTasksResponse struct {
	Body struct {
		GroupId int
	}
}

// TODO: think about parallelism for boosting speed
func (h *handler) CreateTasks(ctx context.Context, input createTasksRequest) (*createTasksResponse, error) {
	formData := input.RawBody.Data()
	if len(formData.Files) == 0 {
		h.Logger.Error("Empty file")
		return nil, huma.Error400BadRequest("Empty file")
	}

	uploadedFiles := []string{}

	userId := ctx.Value("UserId").(int)

	taskGroupID, err := h.TaskGroupService.Create(ctx, userId)
	if err != nil {
		h.Logger.Error(err.Error())
		return nil, huma.Error500InternalServerError("Failed to create task group")
	}

	// for _, files := range formData.File {
	for _, file := range formData.Files {
		fileType := detectFileType(file.Filename)
		uniqueFileName := generateUniqueFileName(file.Filename)

		fileURL, err := h.uploadToMinio(ctx, file.File, uniqueFileName)
		if err != nil {
			h.Logger.Error(err.Error())
			h.rollbackFiles(uploadedFiles)
			return nil, huma.Error500InternalServerError("")
		}
		uploadedFiles = append(uploadedFiles, uniqueFileName)

		taskID, err := h.TaskService.Create(ctx, taskGroupID, fileType, fileURL, file.Filename)
		if err != nil {
			h.Logger.Error(err.Error())
			h.rollbackFiles(uploadedFiles)
			return nil, huma.Error500InternalServerError("")
		}

		err = h.Bus.Task.Publish(nats.Task{TaskId: taskID})
		if err != nil {
			h.Logger.Error(err.Error())
			h.rollbackFiles(uploadedFiles)
			return nil, fmt.Errorf("failed to publish task event to NATS: %w", err)
		}
	}
	// }

	return &createTasksResponse{Body: struct{ GroupId int }{GroupId: taskGroupID}}, nil
}

func (h *handler) uploadToMinio(ctx context.Context, file multipart.File, filename string) (string, error) {
	_, err := h.MinioClient.PutObject(ctx, h.BucketName, filename, file, -1, minio.PutObjectOptions{})
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/%s/%s", h.MinioClient.EndpointURL(), h.BucketName, filename), nil
}

func (h *handler) rollbackFiles(files []string) {
	for _, file := range files {
		err := h.MinioClient.RemoveObject(context.Background(), h.BucketName, file, minio.RemoveObjectOptions{})
		if err != nil {
			h.Logger.Error(fmt.Sprintf("failed to delete file from MinIO: %s, error: %v\n", file, err))
		}
	}
}

func detectFileType(filename string) task.ContentType {
	ext := strings.ToLower(filename[strings.LastIndex(filename, ".")+1:])
	switch ext {
	case "txt", "md", "json", "csv":
		return task.ContentTypeText
	case "jpg", "jpeg", "png", "gif", "bmp":
		return task.ContentTypeImage
	case "mp3", "wav", "flac", "ogg":
		return task.ContentTypeAudio
	case "mp4", "avi", "mov", "wmv":
		return task.ContentTypeVideo
	default:
		return "unknown"
	}
}

func generateUniqueFileName(originalName string) string {
	ext := filepath.Ext(originalName)
	randomBytes := make([]byte, 8)
	rand.Read(randomBytes)
	randomString := hex.EncodeToString(randomBytes)
	return randomString + ext
}
