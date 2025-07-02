package auth

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/auth/internal/permissions"
	"github.com/urodstvo/moderation-service/libs/jwt"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Email    string `json:"email" minLength:"10" maxLength:"100" required:"true"`
	Password string `json:"password" minLength:"4" maxLength:"32" required:"true"`
}

type registerResponse struct {
	Body struct {
		Token string `json:"token"`
	}
}

func (h *Auth) Register(ctx context.Context, input registerRequest) (*registerResponse, error) {
	_, err := h.UserService.GetByEmail(ctx, input.Email)
	if err == nil {
		return nil, huma.Error400BadRequest("User with this email already exists")
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to hash password")
	}

	userId, err := h.UserService.Create(ctx, input.Email, string(bytes))
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create user")
	}

	token, err := jwt.GenerateJWT(userId, permissions.RolePermissions["USER"], h.Config.JWTSecret)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to generate token")
	}

	err = h.TokenService.Create(ctx, token, userId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create token")
	}

	res := &registerResponse{}
	res.Body.Token = token
	return res, nil
}
