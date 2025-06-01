package task_result

import (
	"context"
	"encoding/json"
	"fmt"

	repo "github.com/urodstvo/moderation-service/libs/models/repository/task-result"
)

type service struct {
	repo repo.TaskResultRepository
}

type TaskResult struct {
	TaskId  int                    `json:"task_id"`
	Content map[string]interface{} `json:"content"`
}

type TaskResultService interface {
	Create(ctx context.Context, taskId int, result string) error
	GetByTaskId(ctx context.Context, taskId int) (*TaskResult, error)
}

func NewTaskResultService(repo repo.TaskResultRepository) TaskResultService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, taskId int, result string) error {
	return s.repo.Create(ctx, taskId, result)
}

func (s *service) GetByTaskId(ctx context.Context, taskId int) (*TaskResult, error) {
	result, err := s.repo.GetByTaskId(ctx, taskId)
	if err != nil {
		return nil, err
	}

	var parsedContent map[string]interface{}
	err = json.Unmarshal([]byte(result.Content), &parsedContent)
	if err != nil {
		return nil, fmt.Errorf("failed to parse content JSON: %w", err)
	}

	return &TaskResult{
		TaskId:  result.TaskId,
		Content: parsedContent,
	}, nil
}
