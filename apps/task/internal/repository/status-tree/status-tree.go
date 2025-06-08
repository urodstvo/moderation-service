package status_tree

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

type StatusTreeRepository interface {
	CreateNode(ctx context.Context, node gomodels.TaskStatusNode) error
	GetByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNode, error)
	GetRelationsByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNodeRelation, error)
	UpdateNodeStatus(ctx context.Context, taskId int, nodeKey gomodels.NodeKeyName, status gomodels.NodeStatus) error
}

func NewStatusTreeRepository(db *pgxpool.Pool) StatusTreeRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
