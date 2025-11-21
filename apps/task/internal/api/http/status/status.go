package status

import (
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/log"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger

	StatusService status.StatusTreeService
	Temporal      client.Client
}

type Opts struct {
	fx.In

	Config        config.Config
	Huma          huma.API
	Logger        logger.Logger
	StatusService status.StatusTreeService
	Temporal      client.Client
}

func NewStatusRoutes(opts Opts) handler {
	hostPort := fmt.Sprintf("%s:%d", opts.Config.TemporalHost, opts.Config.TemporalPort)
	c, err := client.Dial(
		client.Options{
			HostPort: hostPort,
			Logger:   log.NewStructuredLogger(opts.Logger.GetSlog()),
		},
	)
	if err != nil {
		panic("Temporal client error")
	}

	a := handler{
		Logger:        opts.Logger,
		StatusService: opts.StatusService,
		Temporal:      c,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "status-check",
			Method:      http.MethodGet,
			Path:        "/request/{requestId}/status",
			Tags:        []string{"Status"},
			Summary:     "Status Check",
		},
		a.Get,
	)

	return a
}
