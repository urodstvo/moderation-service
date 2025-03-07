package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/task-result"
)

type service struct {
	repo repo.TaskResultRepository
}

type TaskResultService interface {
}

func NewTaskResultService(repo repo.TaskResultRepository) TaskResultService {
	return &service{repo: repo}
}
