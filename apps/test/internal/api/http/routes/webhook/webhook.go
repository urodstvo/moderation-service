package webhook

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/test/internal/hub"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type request struct {
	Body any `json:"body"`
}

type response struct{}

type Opts struct {
	fx.In

	Hub    *hub.Hub
	Logger logger.Logger
	Huma   huma.API
}

func New(opts Opts) {
	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "webhook",
			Method:      http.MethodPost,
			Path:        "/webhook",
			Tags:        []string{"Webhook"},
			Summary:     "webhook handler",
		},
		func(ctx context.Context, req *request) (*response, error) {
			// Отправляем контент всем клиентам по SSE
			opts.Hub.Broadcast(req.Body)

			return &response{}, nil
		},
	)
}
