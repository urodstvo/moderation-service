package task

import (
	"context"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task"
	task_group "github.com/urodstvo/moderation-service/libs/models/service/task-group"
)

type ContentType string

const (
	ContentTypeText  ContentType = "text"
	ContentTypeImage ContentType = "image"
	ContentTypeAudio ContentType = "audio"
	ContentTypeVideo ContentType = "video"
)

type service struct {
	repo repo.TaskRepository
}

type TaskService interface {
	Create(ctx context.Context, groupId int, contentType ContentType, filePath string) (int, error)
	GetById(ctx context.Context, id int) (*gomodels.Task, error)
	GetByGroupId(ctx context.Context, groupId int) ([]*gomodels.Task, error)
	UpdateStatus(ctx context.Context, id int, status task_group.TaskStatus) error
}

func NewTaskService(repo repo.TaskRepository) TaskService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, groupId int, contentType ContentType, filePath string) (int, error) {
	return s.repo.Create(ctx, groupId, string(contentType), filePath)
}

func (s *service) GetById(ctx context.Context, id int) (*gomodels.Task, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) GetByGroupId(ctx context.Context, groupId int) ([]*gomodels.Task, error) {
	return s.repo.GetByGroupId(ctx, groupId)
}

func (s *service) UpdateStatus(ctx context.Context, id int, status task_group.TaskStatus) error {
	return s.repo.UpdateStatus(ctx, id, string(status))
}
