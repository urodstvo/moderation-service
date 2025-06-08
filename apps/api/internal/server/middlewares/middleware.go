package middlewares

import (
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger
}

func New(opts Opts) *Middlewares {
	return &Middlewares{
		logger: opts.Logger,
	}
}

type Middlewares struct {
	logger logger.Logger
}
