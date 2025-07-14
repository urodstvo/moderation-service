package blacklist

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type getResponse struct {
	Body []gomodels.Blacklist `json:"body"`
}

func (h *handler) Get(ctx context.Context, _ *struct{}) (*getResponse, error) {
	userId := ctx.Value(constants.UserIdContextKey).(int32)

	blacklist, err := h.Service.GetByUserId(ctx, int(userId))
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get blacklist")
	}

	return &getResponse{Body: blacklist}, nil
}
