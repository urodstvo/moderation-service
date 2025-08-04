package main

import (
	"github.com/urodstvo/moderation-service/apps/webhook/internal/api/http/webhook"
	"github.com/urodstvo/moderation-service/apps/webhook/internal/grpc"
	grpcimpl "github.com/urodstvo/moderation-service/apps/webhook/internal/grpc-impl"
	webhook_repo "github.com/urodstvo/moderation-service/apps/webhook/internal/repository/webhook"
	webhook_service "github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	"github.com/urodstvo/moderation-service/libs/server"
	"github.com/urodstvo/moderation-service/libs/server/middlewares"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Webhook Service",
			},
		),
		// repositories
		fx.Provide(
			webhook_repo.NewWebhookRepository,
		),
		// services
		fx.Provide(
			webhook_service.NewWebhookService,
		),
		// app itself
		fx.Provide(
			middlewares.New,
			server.New,
			grpcimpl.NewImpl,
		),
		fx.Invoke(
			grpc.New,
			webhook.NewWebhookRoutes,
		),
	).Run()
}
