package auth

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	token_service "github.com/urodstvo/moderation-service/libs/models/service/token"
	user_service "github.com/urodstvo/moderation-service/libs/models/service/user"
	"go.uber.org/fx"
)

type Auth struct {
	UserService  user_service.UserService
	TokenService token_service.TokenService
}

type Opts struct {
	fx.In

	UserService  user_service.UserService
	TokenService token_service.TokenService
	Huma         huma.API
}

func NewAuthRoutes(opts Opts) Auth {
	a := Auth{
		UserService:  opts.UserService,
		TokenService: opts.TokenService,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "auth-login",
			Method:      http.MethodPost,
			Path:        "/login",
			Tags:        []string{"Auth"},
			Summary:     "Auth Login",
		},
		func(
			ctx context.Context, i *struct {
				Body loginRequest
			},
		) (*loginResponse, error) {
			return a.Login(ctx, i.Body)
		},
	)

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "auth-register",
			Method:      http.MethodPost,
			Path:        "/register",
			Tags:        []string{"Auth"},
			Summary:     "Auth Register",
		},
		func(
			ctx context.Context, i *struct {
				Body registerRequest
			},
		) (*registerResponse, error) {
			return a.Register(ctx, i.Body)
		},
	)

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "auth-check",
			Method:      http.MethodGet,
			Path:        "/check",
			Tags:        []string{"Auth"},
			Summary:     "Auth Check",
		},
		func(
			ctx context.Context, i *struct {
				Header checkRequest
			},
		) (*checkResponse, error) {
			return a.Check(ctx, i.Header)
		},
	)

	return a
}
