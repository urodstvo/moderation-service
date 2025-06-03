package blacklist

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

type BlacklistRepository interface {
	Create(ctx context.Context, userId int, phrase string) error
	GetByUserId(ctx context.Context, userId int) ([]gomodels.Blacklist, error)
}

func NewTokenRepository(db *pgxpool.Pool) BlacklistRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
