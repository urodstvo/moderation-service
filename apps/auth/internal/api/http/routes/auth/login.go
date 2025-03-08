package auth

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"golang.org/x/crypto/bcrypt"
)

type loginRequest struct {
	Email    string `json:"email" minLength:"10" maxLength:"100" required:"true"`
	Password string `json:"password" minLength:"4" maxLength:"32" required:"true"`
}

type loginResponse struct {
	Token string `json:"token"`
}

func (h *Auth) Login(ctx context.Context, input loginRequest) (*loginResponse, error) {
	user, err := h.UserService.GetByEmail(ctx, input.Email)
	if err != nil {
		return nil, huma.Error400BadRequest("User with this email does not exists")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return nil, huma.Error400BadRequest("Invalid password")
	}

	token, err := h.TokenService.GetByUserId(ctx, user.Id)
	if err != nil {
		return nil, huma.Error400BadRequest("Failed to get token")
	}

	return &loginResponse{Token: token.Token}, nil

}
