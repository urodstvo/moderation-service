package status

import (
	"context"
	"strconv"

	"github.com/danielgtaylor/huma/v2"
)

type getStatusRequest struct {
	RequestId string `path:"requestId"`
}

type getStatusResponse struct {
	Body Graph `json:"body"`
}

func (h *handler) Get(ctx context.Context, input *getStatusRequest) (*getStatusResponse, error) {
	requestId, err := strconv.Atoi(input.RequestId)
	if err != nil {
		return nil, huma.Error400BadRequest("Invalid request ID", err)
	}

	request, err := h.RequestService.GetById(ctx, requestId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get request", err)
	}

	builder := NewGraphBuilder(h.Temporal, h.Logger)
	graph, err := builder.BuildExecutionGraph(ctx, request.WorkflowId, request.RunId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to build status tree", err)
	}

	return &getStatusResponse{Body: *graph}, nil
}
