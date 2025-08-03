package grpcimpl

import (
	service "github.com/urodstvo/moderation-service/apps/auth/internal/service/settings"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
)

type Impl struct {
	proto.UnimplementedAuthServiceServer

	SettingsService service.SettingsService
	Config          config.Config
}
