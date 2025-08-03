package grpcimpl

import (
	service "github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
)

type Impl struct {
	proto.UnimplementedWebhookServiceServer

	WebhookService service.WebhookService
	Config         config.Config
}
