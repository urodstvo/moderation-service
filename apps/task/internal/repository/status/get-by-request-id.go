package status

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByRequestId(ctx context.Context, requestId int) ([]gomodels.StatusNode, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("status_nodes").Where(squirrel.Eq{"request_id": requestId}).OrderBy("created_at").ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var nodes []gomodels.StatusNode
	for rows.Next() {
		var node gomodels.StatusNode
		if err := rows.Scan(&node.Id, &node.RequestId, &node.Title, &node.Details, &node.Status, &node.CreatedAt, &node.UpdatedAt, &node.DeletedAt); err != nil {
			return nil, err
		}
		nodes = append(nodes, node)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return nodes, nil
}
