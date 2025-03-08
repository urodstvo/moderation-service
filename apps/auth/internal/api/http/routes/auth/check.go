package auth

import (
	"context"
	"strings"

	"github.com/danielgtaylor/huma/v2"
)

type checkRequest struct {
	Authotization string `header:"Authorization"`
}

type checkResponse struct {
	UserId string `header:"X-User-Id"`
}

func (h *Auth) Check(ctx context.Context, input checkRequest) (*checkResponse, error) {
	if input.Authotization == "" {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	token := strings.Split(input.Authotization, " ")

	if len(token) != 2 || token[0] != "Bearer" {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	t, err := h.TokenService.GetByToken(ctx, token[1])
	if err != nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	return &checkResponse{UserId: string(t.UserId)}, nil

}
