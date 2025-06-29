package sse

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/sse"
	"github.com/google/uuid"
	"github.com/urodstvo/moderation-service/apps/test/internal/hub"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Hub    *hub.Hub
	Logger logger.Logger
	Huma   huma.API
}

func New(opts Opts) {
	sse.Register(opts.Huma, huma.Operation{
		OperationID: "sse",
		Method:      http.MethodGet,
		Path:        "/sse",
		Summary:     "Server sent events",
	}, map[string]any{}, func(ctx context.Context, input *struct{}, send sse.Sender) {
		id := uuid.NewString()

		opts.Hub.AddClient(id, send)
		defer opts.Hub.RemoveClient(id)

		<-ctx.Done()
	})

}
