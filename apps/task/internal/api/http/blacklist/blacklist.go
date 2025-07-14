package blacklist

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger

	Service blacklist.BlacklistService
}

type Opts struct {
	fx.In

	Huma    huma.API
	Logger  logger.Logger
	Service blacklist.BlacklistService
}

func NewBlacklistRoutes(opts Opts) handler {
	h := handler{
		Logger:  opts.Logger,
		Service: opts.Service,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "add-to-blacklist",
			Method:      http.MethodPost,
			Path:        "/blacklist",
			Tags:        []string{"Blacklist"},
			Summary:     "Add to blacklist",
		},
		h.Add,
	)

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "delete-from-blacklist",
			Method:      http.MethodDelete,
			Path:        "/blacklist/{phraseId}",
			Tags:        []string{"Blacklist"},
			Summary:     "Remove from blacklist",
		},
		h.Delete,
	)

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "get-blacklist",
			Method:      http.MethodGet,
			Path:        "/blacklist",
			Tags:        []string{"Blacklist"},
			Summary:     "Get blacklist",
		},
		h.Get,
	)

	return h
}
