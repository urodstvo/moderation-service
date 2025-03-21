package test

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger
	Huma   huma.API
}

func NewTestRoutes(opts Opts) {
	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "test",
			Method:      http.MethodPost,
			Path:        "/",
			Tags:        []string{"Test"},
			Summary:     "Test",
		},
		func(
			ctx context.Context, i *struct {
				userId string `header:"X-User-Id"`
			},
		) (*struct{}, error) {
			opts.Logger.Info("test", "user_id", i.userId)
			return nil, nil
		},
	)
}
