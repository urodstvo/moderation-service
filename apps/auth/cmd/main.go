package main

import (
	"github.com/urodstvo/moderation-service/apps/auth/internal/api/http"
	"github.com/urodstvo/moderation-service/apps/auth/internal/api/http/routes/auth"
	"github.com/urodstvo/moderation-service/apps/auth/internal/server"
	"github.com/urodstvo/moderation-service/apps/auth/internal/server/middlewares"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	token_repo "github.com/urodstvo/moderation-service/libs/models/repository/token"
	user_repo "github.com/urodstvo/moderation-service/libs/models/repository/user"
	token_service "github.com/urodstvo/moderation-service/libs/models/service/token"
	user_service "github.com/urodstvo/moderation-service/libs/models/service/user"

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
			user_repo.NewUsersRepository,
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
			http.NewHuma,
		),
		fx.Invoke(
			auth.NewAuthRoutes,
		),
	).Run()
}
