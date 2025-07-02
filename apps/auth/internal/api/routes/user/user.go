package user

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/auth/internal/service/token"
	"github.com/urodstvo/moderation-service/apps/auth/internal/service/user"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type User struct {
	Config       config.Config
	Logger       logger.Logger
	UserService  user.UserService
	TokenService token.TokenService
}

type Opts struct {
	fx.In

	Config       config.Config
	Logger       logger.Logger
	UserService  user.UserService
	TokenService token.TokenService
	Huma         huma.API
}

func NewUserRoutes(opts Opts) User {
	u := User{
		Logger:       opts.Logger,
		UserService:  opts.UserService,
		TokenService: opts.TokenService,
		Config:       opts.Config,
	}

	return u
}
