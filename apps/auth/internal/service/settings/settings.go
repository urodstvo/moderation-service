package settings

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/settings"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.SettingsRepository
}

type SettingsService interface {
	UpdateModel(ctx context.Context, userId int, model string) error
	GetByUserId(ctx context.Context, userId int) (gomodels.Settings, error)
}

func NewSettingsService(repo repo.SettingsRepository) SettingsService {
	return &service{repo: repo}
}

func (s *service) GetByUserId(ctx context.Context, userId int) (gomodels.Settings, error) {
	return s.repo.GetByUserId(ctx, userId)
}

func (s *service) UpdateModel(ctx context.Context, userId int, model string) error {
	return s.repo.UpdateModel(ctx, userId, model)
}
