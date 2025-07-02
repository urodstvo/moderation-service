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
	GetByUserId(ctx context.Context, userId int) (gomodels.Webhook, error)
	CreateOrUpdate(ctx context.Context, webhookUrl string, userId int) error
}

func NewWebhookService(repo repo.WebhookRepository) WebhookService {
	return &service{repo: repo}
}

func (s *service) CreateOrUpdate(ctx context.Context, webhookUrl string, userId int) error {
	webhook, err := s.repo.GetByUserId(ctx, userId)
	if err != nil {
		return s.repo.Create(ctx, webhookUrl, userId)
	}

	if webhook.WebhookUrl != webhookUrl {
		return s.repo.Update(ctx, webhookUrl, userId)
	}

	return nil
}

func (s *service) GetByUserId(ctx context.Context, userId int) (gomodels.Webhook, error) {
	return s.repo.GetByUserId(ctx, userId)
}
