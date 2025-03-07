package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task"
)

type service struct {
	repo repo.TaskRepository
}

type TaskService interface {
}

func NewTaskService(repo repo.TaskRepository) TaskService {
	return &service{repo: repo}
}
