package user

import (
	repo "github.com/urodstvo/moderation-service/libs/models/repository/webhook"
)

type service struct {
	repo repo.WebhookRepository
}

type WebhookService interface {
}

func NewWebhookService(repo repo.WebhookRepository) WebhookService {
	return &service{repo: repo}
}
