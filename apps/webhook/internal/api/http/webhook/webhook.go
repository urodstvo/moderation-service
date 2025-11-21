package webhook

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/webhook/internal/service/webhook"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type handler struct {
	Logger  logger.Logger
	Service webhook.WebhookService
}

type Opts struct {
	fx.In

	Huma   huma.API
	Logger logger.Logger

	Service webhook.WebhookService
}

func NewWebhookRoutes(opts Opts) handler {
	h := handler{
		Logger:  opts.Logger,
		Service: opts.Service,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "webhook-register",
			Method:      http.MethodPost,
			Path:        "/register",
			Tags:        []string{"Webhook"},
			Summary:     "Webhook Registration",
		},
		h.Register,
	)

	return h
}
