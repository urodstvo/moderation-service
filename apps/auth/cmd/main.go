package main

import (
	api "github.com/urodstvo/moderation-service/apps/auth/internal/api"
	token_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/token"
	user_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/user"
	token_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/token"
	user_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/user"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	"github.com/urodstvo/moderation-service/libs/server"
	"github.com/urodstvo/moderation-service/libs/server/middlewares"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Authorization Service",
			},
		),
		// repositories
		fx.Provide(
			user_repo.NewUserRepository,
			token_repo.NewTokenRepository,
		),
		// services
		fx.Provide(
			token_service.NewTokenService,
			user_service.NewUserService,
		),
		// app itself
		fx.Provide(
			middlewares.New,
			server.New,
			api.NewHuma,
		),
		fx.Invoke(),
	).Run()
}
