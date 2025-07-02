package result

import (
	"context"
	"encoding/json"
	"fmt"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/result"
)

type service struct {
	repo repo.ResultRepository
}

type Result struct {
	RequestId int            `json:"request_id"`
	Raw       map[string]any `json:"raw"`
	Formatted map[string]any `json:"formatted"`
}

type ResultService interface {
	Create(ctx context.Context, requestId int, result string) error
	GetByTaskId(ctx context.Context, requestId int) (*Result, error)
}

func NewResultService(repo repo.ResultRepository) ResultService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, requestId int, result string) error {
	return s.repo.Create(ctx, requestId, result)
}

func (s *service) GetByTaskId(ctx context.Context, requestId int) (*Result, error) {
	result, err := s.repo.GetByRequestId(ctx, requestId)
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

	return &Result{
		RequestId: result.RequestId,
		Raw:       parsedRawContent,
		Formatted: parsedFormattedContent,
	}, nil
}
