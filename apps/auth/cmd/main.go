package main

import (
	"github.com/urodstvo/moderation-service/apps/auth/internal/grpc"
	role_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/role"
	token_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/token"
	user_repo "github.com/urodstvo/moderation-service/apps/auth/internal/repository/user"
	role_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/role"
	token_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/token"
	user_service "github.com/urodstvo/moderation-service/apps/auth/internal/service/user"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"

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
			role_repo.NewRoleRepository,
		),
		// services
		fx.Provide(
			token_service.NewTokenService,
			user_service.NewUserService,
			role_service.NewRoleService,
		),
		// app itself
		fx.Provide(),
		fx.Invoke(
			grpc.New,
		),
	).Run()
}
