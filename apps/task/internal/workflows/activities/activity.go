package activities

import (
	"github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/result"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger

	WebhoockClient proto.WebhookServiceClient
	AuthClient     proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	ResultService    result.ResultService
	RequestService   request.RequestService
}

type Activity struct {
	Logger logger.Logger

	WebhoockClient proto.WebhookServiceClient
	AuthClient     proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	RequestService   request.RequestService
	ResultService    result.ResultService
}

func New(opts Opts) *Activity {
	return &Activity{
		Logger:           opts.Logger,
		WebhoockClient:   opts.WebhoockClient,
		AuthClient:       opts.AuthClient,
		BlacklistService: opts.BlacklistService,
		ResultService:    opts.ResultService,
		RequestService:   opts.RequestService,
	}
}
