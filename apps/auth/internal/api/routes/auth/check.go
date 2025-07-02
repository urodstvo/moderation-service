package auth

import (
	"context"
	"strconv"
	"strings"

	"github.com/danielgtaylor/huma/v2"
)

type checkRequest struct {
	Authorization string `header:"Authorization"`
}

type checkResponse struct {
	UserId string `header:"X-User-Id"`
	Role   string `header:"X-User-Role"`
}

func (h *Auth) Verify(ctx context.Context, input checkRequest) (*checkResponse, error) {
	if input.Authorization == "" {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	token := strings.Split(input.Authorization, " ")
	if len(token) != 2 || token[0] != "Bearer" {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	t, err := h.TokenService.GetByToken(ctx, token[1])
	if err != nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	user, err := h.UserService.GetById(ctx, t.UserId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get user")
	}

	return &checkResponse{UserId: strconv.Itoa(user.Id), Role: user.Role}, nil
}
