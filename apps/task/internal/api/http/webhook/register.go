package webhook_routes

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/webhook"
)

type registerRequest struct {
	Body struct {
		WebhookURL string `json:"webhook_url" minLength:"10" maxLength:"100" required:"true"`
	}
}

func (h *handler) Register(ctx context.Context, input registerRequest) (*struct{}, error) {
	url := input.Body.WebhookURL
	if !webhook.ValidateWebhook(url) {
		return nil, huma.Error400BadRequest("Invalid webhook url")
	}

	userId := ctx.Value("UserId").(int)

	err := h.WebhookService.Create(ctx, url, userId)
	if err != nil {
		h.Logger.Error(err.Error())
		return nil, huma.Error500InternalServerError("Failed to create webhook")
	}

	return nil, nil
}
