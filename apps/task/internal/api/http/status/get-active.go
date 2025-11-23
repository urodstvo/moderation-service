package status

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/constants"
)

type getActiveStatusResponse struct {
	Body []Graph `json:"body"`
}

func (h *handler) GetActive(ctx context.Context, _ *struct{}) (*getActiveStatusResponse, error) {
	userId := ctx.Value(constants.UserIdContextKey).(int)

	requests, err := h.RequestService.GetActive(ctx, userId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get requests", err)
	}

	graphs := make([]Graph, 0, len(requests))
	for _, request := range requests {
		builder := NewGraphBuilder(h.Temporal, h.Logger)
		graph, err := builder.BuildExecutionGraph(ctx, request.WorkflowId, request.RunId)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to build status tree", err)
		}
		graphs = append(graphs, *graph)
	}

	return &getActiveStatusResponse{Body: graphs}, nil
}
