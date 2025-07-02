package request

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/request"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.RequestRepository
}

type RequestService interface {
	Create(ctx context.Context, userId int) (int, error)
	GetById(ctx context.Context, id int) (gomodels.Request, error)
	UpdateStatus(ctx context.Context, id int, status gomodels.Status) error
}

func NewRequestService(repo repo.RequestRepository) RequestService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, userId int) (int, error) {
	return s.repo.Create(ctx, userId)
}
func (s *service) UpdateStatus(ctx context.Context, id int, status gomodels.Status) error {
	return s.repo.UpdateStatus(ctx, id, status)
}

func (s *service) GetById(ctx context.Context, id int) (gomodels.Request, error) {
	return s.repo.GetById(ctx, id)
}
