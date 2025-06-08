package status_tree

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) UpdateNodeStatus(ctx context.Context, taskId int, nodeKey gomodels.NodeKeyName, status gomodels.NodeStatus) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Update("task_status_nodes").
		Set("status", status).
		Where(squirrel.Eq{"task_id": taskId, "node_key": nodeKey}).
		ToSql()

	if err != nil {
		return err
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows updated for task_id: %d and node_key: %s", taskId, nodeKey)
	}

	return nil
}
