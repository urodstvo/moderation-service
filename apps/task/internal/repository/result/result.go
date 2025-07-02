package result

import (
	"context"

	"github.com/Masterminds/squirrel"
	trmpgx "github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type repository struct {
	db     *pgxpool.Pool
	getter *trmpgx.CtxGetter
}

type ResultRepository interface {
	Create(ctx context.Context, requestId int, result string) error
	GetByRequestId(ctx context.Context, requestId int) (gomodels.RequestResult, error)
}

func NewResultRepository(db *pgxpool.Pool) ResultRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
