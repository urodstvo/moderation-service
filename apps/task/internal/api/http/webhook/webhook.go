package webhook

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	grpc "github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger

	client grpc.WebhookServiceClient
}

type Opts struct {
	fx.In

	Huma   huma.API
	Logger logger.Logger
	client grpc.WebhookServiceClient
}

func NewWebhookRoutes(opts Opts) handler {
	h := handler{
		Logger: opts.Logger,
		client: opts.client,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "webhook-register",
			Method:      http.MethodPost,
			Path:        "/webhook",
			Tags:        []string{"Webhook"},
			Summary:     "Webhook Registration",
		},
		h.Register,
	)

	return h
}
