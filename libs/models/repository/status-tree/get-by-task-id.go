package status_tree

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNode, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("task_status_nodes").Where(squirrel.Eq{"task_id": taskId}).ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var nodes []gomodels.TaskStatusNode
	for rows.Next() {
		var node gomodels.TaskStatusNode
		if err := rows.Scan(&node.TaskId, &node.NodeKey, &node.Status, &node.Details, &node.CreatedAt, &node.UpdatedAt, &node.DeletedAt); err != nil {
			return nil, err
		}
		nodes = append(nodes, node)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return nodes, nil
}
