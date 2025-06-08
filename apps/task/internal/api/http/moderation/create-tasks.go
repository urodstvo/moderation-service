// package moderation_routes

// import (
// 	"context"
// 	"crypto/rand"
// 	"encoding/hex"
// 	"fmt"
// 	"mime/multipart"
// 	"path/filepath"
// 	"strings"
// 	"sync"

// 	"github.com/danielgtaylor/huma/v2"
// 	"github.com/minio/minio-go/v7"
// 	"github.com/urodstvo/moderation-service/libs/models/service/task"
// 	"github.com/urodstvo/moderation-service/libs/nats"
// 	"golang.org/x/sync/errgroup"
// )

// type createTasksRequest struct {
// 	RawBody huma.MultipartFormFiles[struct {
// 		Files []huma.FormFile `form:"file"`
// 	}]
// }

// type createTasksResponse struct {
// 	Body struct {
// 		GroupId int
// 	}
// }

// // TODO: think about parallelism for boosting speed
// func (h *handler) CreateTasks(ctx context.Context, input createTasksRequest) (*createTasksResponse, error) {
// 	formData := input.RawBody.Data()
// 	if len(formData.Files) == 0 {
// 		h.Logger.Error("Empty file")
// 		return nil, huma.Error400BadRequest("Empty file")
// 	}

// 	userId := ctx.Value("UserId").(int)

// 	taskGroupID, err := h.TaskGroupService.Create(ctx, userId)
// 	if err != nil {
// 		h.Logger.Error(err.Error())
// 		return nil, huma.Error500InternalServerError("Failed to create task group")
// 	}

// 	var (
// 		uploadedFilesMu sync.Mutex
// 		uploadedFiles   []string
// 	)

// 	g, ctx := errgroup.WithContext(ctx)
// 	semaphore := make(chan struct{}, 5) // ограничим параллелизм (например, 5 горутин одновременно)

// 	for _, file := range formData.Files {
// 		file := file // захват переменной в замыкании
// 		semaphore <- struct{}{}

// 		g.Go(func() error {
// 			defer func() { <-semaphore }()

// 			fileType := detectFileType(file.Filename)
// 			uniqueFileName := generateUniqueFileName(file.Filename)

// 			fileURL, err := h.uploadToMinio(ctx, file.File, file.Size, uniqueFileName)
// 			if err != nil {
// 				return fmt.Errorf("upload failed: %w", err)
// 			}

// 			uploadedFilesMu.Lock()
// 			uploadedFiles = append(uploadedFiles, uniqueFileName)
// 			uploadedFilesMu.Unlock()

// 			taskID, err := h.TaskService.Create(ctx, taskGroupID, fileType, fileURL, file.Filename)
// 			if err != nil {
// 				return fmt.Errorf("task creation failed: %w", err)
// 			}

// 			if err := h.Bus.Task.Publish(nats.Task{TaskId: taskID}); err != nil {
// 				return fmt.Errorf("NATS publish failed: %w", err)
// 			}

// 			return nil
// 		})
// 	}

// 	if err := g.Wait(); err != nil {
// 		h.Logger.Error(err.Error())
// 		h.rollbackFiles(uploadedFiles)
// 		return nil, huma.Error500InternalServerError("Some files failed to process")
// 	}

// 	return &createTasksResponse{Body: struct{ GroupId int }{GroupId: taskGroupID}}, nil
// }

// func (h *handler) uploadToMinio(ctx context.Context, file multipart.File, size int64, filename string) (string, error) {
// 	if size <= 0 {
// 		return "", fmt.Errorf("invalid file size")
// 	}
// 	_, err := h.MinioClient.PutObject(ctx, h.BucketName, filename, file, size, minio.PutObjectOptions{})
// 	if err != nil {
// 		return "", err
// 	}
// 	return fmt.Sprintf("%s/%s/%s", h.MinioClient.EndpointURL(), h.BucketName, filename), nil
// }

// func (h *handler) rollbackFiles(files []string) {
// 	for _, file := range files {
// 		err := h.MinioClient.RemoveObject(context.Background(), h.BucketName, file, minio.RemoveObjectOptions{})
// 		if err != nil {
// 			h.Logger.Error(fmt.Sprintf("failed to delete file from MinIO: %s, error: %v\n", file, err))
// 		}
// 	}
// }

// func detectFileType(filename string) task.ContentType {
// 	ext := strings.ToLower(filename[strings.LastIndex(filename, ".")+1:])
// 	switch ext {
// 	case "txt", "md", "json", "csv":
// 		return task.ContentTypeText
// 	case "jpg", "jpeg", "png", "gif", "bmp":
// 		return task.ContentTypeImage
// 	case "mp3", "wav", "flac", "ogg":
// 		return task.ContentTypeAudio
// 	case "mp4", "avi", "mov", "wmv":
// 		return task.ContentTypeVideo
// 	default:
// 		return "unknown"
// 	}
// }

// func generateUniqueFileName(originalName string) string {
// 	ext := filepath.Ext(originalName)
// 	randomBytes := make([]byte, 8)
// 	rand.Read(randomBytes)
// 	randomString := hex.EncodeToString(randomBytes)
// 	return randomString + ext
// }
