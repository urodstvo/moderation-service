package analysis

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/minio/minio-go/v7"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/file"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.temporal.io/sdk/client"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger
	Config config.Config
	Minio  *minio.Client

	Temporal client.Client
	Workflow *workflows.Workflow

	RequestService request.RequestService
	FileService    file.FileService
	StatusService  status.StatusTreeService
}

type Opts struct {
	fx.In

	Huma   huma.API
	Logger logger.Logger
	Config config.Config
	Minio  *minio.Client

	Temporal client.Client
	Workflow *workflows.Workflow

	RequestService request.RequestService
	FileService    file.FileService
	StatusService  status.StatusTreeService
}

func NewAnalysisRoutes(opts Opts) handler {
	h := handler{
		Config:         opts.Config,
		Logger:         opts.Logger,
		Minio:          opts.Minio,
		Temporal:       opts.Temporal,
		StatusService:  opts.StatusService,
		RequestService: opts.RequestService,
		FileService:    opts.FileService,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "sync-analysis",
			Method:      http.MethodPost,
			Path:        "/analysis/sync",
			Tags:        []string{"Analysis"},
			Summary:     "Sync analysis",
		},
		h.Sync,
	)

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "async-analysis",
			Method:      http.MethodPost,
			Path:        "/analysis/async",
			Tags:        []string{"Analysis"},
			Summary:     "Async analysis",
		},
		h.Async,
	)

	return h
}
