package main

import (
	"github.com/urodstvo/moderation-service/apps/webhook/internal/grpc"
	webhook_repo "github.com/urodstvo/moderation-service/apps/webhook/internal/repository/webhook"
	webhook_service "github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"

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
		fx.Provide(),
		fx.Invoke(
			grpc.New,
		),
	).Run()
}
