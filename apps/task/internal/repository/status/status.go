package status

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
	CreateNode(ctx context.Context, node gomodels.StatusNode) error
	GetByRequestId(ctx context.Context, requestId int) ([]gomodels.StatusNode, error)
	GetRelationsByRequestId(ctx context.Context, requestkId int) ([]gomodels.StatusNodeRelation, error)
	UpdateNodeStatus(ctx context.Context, nodeId int, status gomodels.Status) error

	CreateRelation(ctx context.Context, relation gomodels.StatusNodeRelation) error
}

func NewStatusTreeRepository(db *pgxpool.Pool) StatusTreeRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

var sq = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
