package grpc

import (
	"context"
	"fmt"
	"net"

	grpcimpl "github.com/urodstvo/moderation-service/apps/webhook/internal/grpc-impl"
	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.uber.org/fx"
	"google.golang.org/grpc"
)

type Opts struct {
	fx.In

	LC      fx.Lifecycle
	Logger  logger.Logger
	Service grpcimpl.Impl
}

func New(opts Opts) error {
	grpcNetListener, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", constants.WEBHOOK_SERVER_PORT))
	if err != nil {
		return err
	}

	grpcServer := grpc.NewServer(grpc.StatsHandler(otelgrpc.NewServerHandler()))
	webhook.RegisterWebhookServiceServer(grpcServer, opts.Service)

	opts.LC.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				go grpcServer.Serve(grpcNetListener)
				opts.Logger.Info("Grpc server is running")
				return nil
			},
			OnStop: func(ctx context.Context) error {
				grpcServer.GracefulStop()
				return nil
			},
		},
	)

	return nil
}
