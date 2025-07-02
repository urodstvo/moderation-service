package file

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

type FileRepository interface {
	Create(ctx context.Context, requestId int, contentType string, filename string, originalFilename string) (int, error)
	GetById(ctx context.Context, id int) (gomodels.File, error)
	GetByRequestId(ctx context.Context, requestId int) ([]gomodels.File, error)
}

func NewFileRepository(db *pgxpool.Pool) FileRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
