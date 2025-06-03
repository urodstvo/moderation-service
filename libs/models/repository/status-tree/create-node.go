package status_tree

import (
	"context"
	"fmt"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) CreateNode(ctx context.Context, node gomodels.TaskStatusNode) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("task_status_nodes").
		Columns("task_id", "node_key", "details").
		Values(node.TaskId, node.NodeKey, node.Details).ToSql()

	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows inserted")
	}

	return nil
}
