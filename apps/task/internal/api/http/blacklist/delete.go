package blacklist

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
)

type removeRequest struct {
	PhraseId int `path:"phraseId"`
}

func (h *handler) Delete(ctx context.Context, input *removeRequest) (*struct{}, error) {
	// TODO: add check if user owns the phraseId
	if err := h.Service.Delete(ctx, input.PhraseId); err != nil {
		h.Logger.Error(err.Error())
		return nil, huma.Error500InternalServerError("Failed to delete phrase from blacklist", err)
	}
	return nil, nil
}
