package task

import (
	"context"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task"
)

type service struct {
	repo repo.TaskRepository
}

type TaskService interface {
	Create(ctx context.Context, groupId int, contentType gomodels.ContentType, filename string, originalFilename string) (int, error)
	GetById(ctx context.Context, id int) (gomodels.Task, error)
	GetByGroupId(ctx context.Context, groupId int) ([]gomodels.Task, error)
}

func NewTaskService(repo repo.TaskRepository) TaskService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, groupId int, contentType gomodels.ContentType, filename string, originalFilename string) (int, error) {
	return s.repo.Create(ctx, groupId, string(contentType), filename, originalFilename)
}

func (s *service) GetById(ctx context.Context, id int) (gomodels.Task, error) {
	return s.repo.GetById(ctx, id)
}

func (s *service) GetByGroupId(ctx context.Context, groupId int) ([]gomodels.Task, error) {
	return s.repo.GetByGroupId(ctx, groupId)
}
