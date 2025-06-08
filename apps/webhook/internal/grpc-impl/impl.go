package grpcimpl

import "github.com/urodstvo/moderation-service/libs/grpc/webhook"

type Impl struct {
	webhook.UnimplementedWebhookServiceServer
}
