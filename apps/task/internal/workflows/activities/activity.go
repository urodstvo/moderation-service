package activities

import (
	"github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/file"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/result"
	statussvc "github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger

	WebhookClient proto.WebhookServiceClient
	AuthClient    proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	FileService      file.FileService
	ResultService    result.ResultService
	RequestService   request.RequestService
	StatusService    statussvc.StatusTreeService
}

type Activity struct {
	Logger logger.Logger

	WebhookClient proto.WebhookServiceClient
	AuthClient    proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	FileService      file.FileService
	RequestService   request.RequestService
	ResultService    result.ResultService
	StatusService    statussvc.StatusTreeService
}

func New(opts Opts) *Activity {
	return &Activity{
		Logger:           opts.Logger,
		WebhookClient:    opts.WebhookClient,
		AuthClient:       opts.AuthClient,
		BlacklistService: opts.BlacklistService,
		FileService:      opts.FileService,
		ResultService:    opts.ResultService,
		RequestService:   opts.RequestService,
		StatusService:    opts.StatusService,
	}
}
