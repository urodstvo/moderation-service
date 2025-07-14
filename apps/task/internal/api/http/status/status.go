package status

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger

	StatusService status.StatusTreeService
}

type Opts struct {
	fx.In

	Huma          huma.API
	Logger        logger.Logger
	StatusService status.StatusTreeService
}

func NewStatusRoutes(opts Opts) handler {
	a := handler{
		Logger:        opts.Logger,
		StatusService: opts.StatusService,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "status-check",
			Method:      http.MethodGet,
			Path:        "/status/{requestId}",
			Tags:        []string{"Status"},
			Summary:     "Status Check",
		},
		a.Get,
	)

	return a
}
