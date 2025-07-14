package activities

import (
	"github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger

	BlacklistService blacklist.BlacklistService
	WebhoockClient   webhook.WebhookServiceClient
}

type Activity struct {
	Logger logger.Logger

	BlacklistService blacklist.BlacklistService
	WebhoockClient   webhook.WebhookServiceClient
}

func New(opts Opts) *Activity {
	return &Activity{
		Logger:           opts.Logger,
		BlacklistService: opts.BlacklistService,
		WebhoockClient:   opts.WebhoockClient,
	}
}
