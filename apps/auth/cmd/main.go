package main

import (
	api "github.com/urodstvo/moderation-service/apps/auth/internal/api"
	"github.com/urodstvo/moderation-service/apps/auth/internal/api/routes/auth"
	"github.com/urodstvo/moderation-service/apps/auth/internal/api/routes/user"
	"github.com/urodstvo/moderation-service/apps/auth/internal/grpc"
	grpcimpl "github.com/urodstvo/moderation-service/apps/auth/internal/grpc-impl"
	settings_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/settings"
	token_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/token"
	user_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/user"
	settings_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/settings"
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
			settings_repo.NewSettingsRepository,
		),
		// services
		fx.Provide(
			token_service.NewTokenService,
			user_service.NewUserService,
			settings_service.NewSettingsService,
		),
		// app itself
		fx.Provide(
			middlewares.New,
			server.New,
			api.NewHuma,
			grpcimpl.NewImpl,
		),
		fx.Invoke(
			grpc.New,
			user.NewUserRoutes,
			auth.NewAuthRoutes,
		),
	).Run()
}
