package task_group

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

type TaskGroupRepository interface {
	Create(ctx context.Context, userId int) (int, error)
	GetByUserId(ctx context.Context, userId int) (*gomodels.TaskGroup, error)
	GetById(ctx context.Context, id int) (*gomodels.TaskGroup, error)
	UpdateStatus(ctx context.Context, id int, status string) error

	AreAllTasksCompleted(ctx context.Context, groupId int) (bool, error)
	CountTasksInGroup(ctx context.Context, groupId int) (int, error)
	CountCompletedTasksInGroup(ctx context.Context, groupId int) (int, error)
}

func NewTaskGroupRepository(db *pgxpool.Pool) TaskGroupRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
