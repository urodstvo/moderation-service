package grpcimpl

import (
	service "github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"go.uber.org/fx"
)

type Impl struct {
	proto.UnimplementedWebhookServiceServer

	WebhookService service.WebhookService
	Config         config.Config
}

type Opts struct {
	fx.In

	WebhookService service.WebhookService
	Config         config.Config
}

func NewImpl(opts Opts) *Impl {
	return &Impl{
		WebhookService: opts.WebhookService,
		Config:         opts.Config,
	}
}
