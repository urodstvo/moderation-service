package status

import (
	"context"
	"fmt"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) CreateNode(ctx context.Context, node gomodels.StatusNode) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("status_nodes").
		Columns("request_id", "title", "details").
		Values(node.RequestId, node.Title, node.Details).
		Suffix("RETURNING id").
		ToSql()

	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var id int
	err = conn.QueryRow(ctx, query, args...).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return id, nil
}
