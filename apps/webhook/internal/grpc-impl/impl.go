package grpcimpl

import (
	service "github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
)

type Impl struct {
	webhook.UnimplementedWebhookServiceServer

	WebhookService service.WebhookService
	Config         config.Config
}
