package blacklist

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
)

type addRequest struct {
	Body struct {
		Phrase string `json:"phrase"`
	} `json:"body"`
}

func (h *handler) Add(ctx context.Context, req *addRequest) (*struct{}, error) {
	userId := ctx.Value(constants.UserIdContextKey).(int32)

	err := h.Service.Create(ctx, int(userId), req.Body.Phrase)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to add phrase to blacklist")
	}

	return nil, nil
}
