package request

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

type RequestRepository interface {
	Create(ctx context.Context, userId int) (int, error)
	GetById(ctx context.Context, id int) (gomodels.Request, error)
	UpdateStatus(ctx context.Context, id int, status gomodels.Status) error
}

func NewRequestRepository(db *pgxpool.Pool) RequestRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
