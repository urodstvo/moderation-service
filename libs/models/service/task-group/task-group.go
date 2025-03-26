package task_group

import (
	"context"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task-group"
)

type TaskStatus string

const (
	TaskStatusCreated   TaskStatus = "created"
	TaskStatusProcessed TaskStatus = "processed"
	TaskStatusCompleted TaskStatus = "completed"
)

type service struct {
	repo repo.TaskGroupRepository
}

type TaskGroupService interface {
	Create(ctx context.Context, userId int) (int, error)
	GetByUserId(ctx context.Context, userId int) (*gomodels.TaskGroup, error)
	GetById(ctx context.Context, id int) (*gomodels.TaskGroup, error)
	UpdateStatus(ctx context.Context, id int, status TaskStatus) error
}

func NewTaskGroupService(repo repo.TaskGroupRepository) TaskGroupService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, userId int) (int, error) {
	return s.repo.Create(ctx, userId)
}

func (s *service) GetByUserId(ctx context.Context, userId int) (*gomodels.TaskGroup, error) {
	return s.repo.GetByUserId(ctx, userId)
}

func (s *service) UpdateStatus(ctx context.Context, id int, status TaskStatus) error {
	return s.repo.UpdateStatus(ctx, id, string(status))
}

func (s *service) GetById(ctx context.Context, id int) (*gomodels.TaskGroup, error) {
	return s.repo.GetById(ctx, id)
}
