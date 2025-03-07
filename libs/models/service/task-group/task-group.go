package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task-group"
)

type service struct {
	repo repo.TaskGroupRepository
}

type TaskGroupService interface {
}

func NewTaskGroupService(repo repo.TaskGroupRepository) TaskGroupService {
	return &service{repo: repo}
}
