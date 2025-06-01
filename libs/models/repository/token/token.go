package token

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

type TokenRepository interface {
	Create(ctx context.Context, token string, userId int) error
	GetByUserId(ctx context.Context, userId int) (*gomodels.Token, error)
	GetByToken(ctx context.Context, token string) (*gomodels.Token, error)
}

func NewTokenRepository(db *pgxpool.Pool) TokenRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
