package webhook

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
	grpc "github.com/urodstvo/moderation-service/libs/grpc/webhook"
)

type registerRequest struct {
	Body struct {
		WebhookUrl string `json:"webhook_url"`
	} `json:"body"`
}

func (h *handler) Register(ctx context.Context, req *registerRequest) (*struct{}, error) {
	userId := ctx.Value(constants.UserIdContextKey).(int32)

	_, err := h.client.UpdateWebhook(ctx, &grpc.UpdateWebhookRequest{
		UserId:     userId,
		WebhookUrl: req.Body.WebhookUrl,
	})
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to register webhook")
	}

	return nil, nil
}
