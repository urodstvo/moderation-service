package blacklist

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
)

type removeRequest struct {
	phraseId int `path:"phraseId"`
}

func (h *handler) Delete(ctx context.Context, input *removeRequest) (*struct{}, error) {
	if err := h.Service.Delete(ctx, input.phraseId); err != nil {
		return nil, huma.Error500InternalServerError("Failed to delete phrase from blacklist", err)
	}
	return nil, nil
}
