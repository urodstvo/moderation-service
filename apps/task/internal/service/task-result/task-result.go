package task_result

import (
	"context"
	"encoding/json"
	"fmt"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/task-result"
)

type service struct {
	repo repo.TaskResultRepository
}

type TaskResult struct {
	TaskId    int            `json:"task_id"`
	Raw       map[string]any `json:"raw"`
	Formatted map[string]any `json:"formatted"`
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

	var parsedRawContent map[string]any
	err = json.Unmarshal([]byte(result.Raw), &parsedRawContent)
	if err != nil {
		return nil, fmt.Errorf("failed to parse content JSON: %w", err)
	}

	var parsedFormattedContent map[string]any
	if result.Formatted.Valid {
		err = json.Unmarshal([]byte(result.Formatted.String), &parsedFormattedContent)
		if err != nil {
			return nil, fmt.Errorf("failed to parse content JSON: %w", err)
		}
	} else {
		parsedFormattedContent = nil
	}

	return &TaskResult{
		TaskId:    result.TaskId,
		Raw:       parsedRawContent,
		Formatted: parsedFormattedContent,
	}, nil
}
