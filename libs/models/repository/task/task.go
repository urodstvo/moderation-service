package task

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

type TaskRepository interface {
	Create(ctx context.Context, groupId int, contentType string, filename string, originalFilename string) (int, error)
	GetById(ctx context.Context, id int) (gomodels.Task, error)
	GetByGroupId(ctx context.Context, groupId int) ([]gomodels.Task, error)
}

func NewTaskRepository(db *pgxpool.Pool) TaskRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
