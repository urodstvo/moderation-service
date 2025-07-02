package user

import (
	"context"
	"strings"
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type getMeRequest struct {
	Authorization string `header:"Authorization"`
}

type UserResponse struct {
	Id        int        `json:"id"`
	Email     string     `json:"email"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
	Role      string     `json:"role"`
}

type getMeResponse struct {
	Body struct {
		User UserResponse `json:"user"`
	}
}

func (h *User) GetMe(ctx context.Context, req getMeRequest) (*getMeResponse, error) {
	if req.Authorization == "" {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	token := strings.Split(req.Authorization, " ")
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

	response := &getMeResponse{}
	response.Body.User = UserResponse{
		Id:        user.Id,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	if user.DeletedAt.Valid {
		response.Body.User.DeletedAt = &user.DeletedAt.Time
	} else {
		response.Body.User.DeletedAt = nil
	}

	return response, nil
}
