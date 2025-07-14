package status

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type getStatusRequest struct {
	RequestId int `path:"requestId"`
}

type getStatusResponse struct {
	Body gomodels.StatusTree `json:"body"`
}

func (h *handler) Get(ctx context.Context, input *getStatusRequest) (*getStatusResponse, error) {
	tree, err := h.StatusService.GetStatusTree(ctx, input.RequestId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get status tree")
	}

	return &getStatusResponse{Body: tree}, nil
}
