package grpcimpl

import (
	service "github.com/urodstvo/moderation-service/apps/auth/internal/service/settings"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Impl struct {
	proto.UnimplementedAuthServiceServer

	SettingsService service.SettingsService
	Config          config.Config
	Logger          logger.Logger
}

type Opts struct {
	fx.In

	SettingsService service.SettingsService
	Config          config.Config
	Logger          logger.Logger
}

func NewImpl(opts Opts) *Impl {
	return &Impl{
		SettingsService: opts.SettingsService,
		Config:          opts.Config,
		Logger:          opts.Logger,
	}
}
