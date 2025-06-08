package webhook

import (
	"context"

	repo "github.com/urodstvo/moderation-service/apps/webhook/internal/repository/webhook"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type service struct {
	repo repo.WebhookRepository
}

type WebhookService interface {
	Create(ctx context.Context, url string, userId int) error
	GetByUserId(ctx context.Context, userId int) (gomodels.Webhook, error)
}

func NewWebhookService(repo repo.WebhookRepository) WebhookService {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, webhookUrl string, userId int) error {
	return s.repo.Create(ctx, webhookUrl, userId)
}

func (s *service) GetByUserId(ctx context.Context, userId int) (gomodels.Webhook, error) {
	return s.repo.GetByUserId(ctx, userId)
}
