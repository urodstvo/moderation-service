package webhook

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/webhook/internal/constants"
)

type registerRequest struct {
	Body struct {
		WebhookUrl string `json:"webhook_url"`
	} `json:"body"`
}

func (h *handler) Register(ctx context.Context, req *registerRequest) (*struct{}, error) {
	userId := ctx.Value(constants.UserIdContextKey).(int)

	err := h.Service.CreateOrUpdate(ctx, req.Body.WebhookUrl, userId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to register webhook")
	}

	return nil, nil
}
