package baseapp

import (
	"context"
	"log/slog"
	"time"

	trmpgx "github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2"
	"github.com/avito-tech/go-transaction-manager/trm/v2"
	"github.com/avito-tech/go-transaction-manager/trm/v2/manager"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Opts struct {
	AppName string
}

func CreateBaseApp(opts Opts) fx.Option {
	return fx.Options(
		fx.Provide(
			config.NewFx,
			newPgxPool,
			// bus.NewNatsBusFx(opts.AppName),
			logger.NewFx(
				logger.Opts{
					Service: opts.AppName,
					Level:   slog.LevelInfo,
				},
			),
		),
	)
}

type PgxResult struct {
	fx.Out

	PgxPool   *pgxpool.Pool
	TrManager trm.Manager
}

func newPgxPool(cfg config.Config) (PgxResult, error) {
	connConfig, err := pgxpool.ParseConfig(cfg.DatabaseUrl)
	if err != nil {
		return PgxResult{}, err
	}

	connConfig.MaxConnLifetime = time.Hour
	connConfig.MaxConnIdleTime = 5 * time.Minute
	connConfig.MaxConns = 100
	connConfig.MinConns = 1
	connConfig.HealthCheckPeriod = time.Minute
	connConfig.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	pool, err := pgxpool.NewWithConfig(
		context.Background(),
		connConfig,
	)
	if err != nil {
		return PgxResult{}, err
	}

	trManager, err := manager.New(trmpgx.NewDefaultFactory(pool))
	if err != nil {
		return PgxResult{}, err
	}

	return PgxResult{
		PgxPool:   pool,
		TrManager: trManager,
	}, nil
}
