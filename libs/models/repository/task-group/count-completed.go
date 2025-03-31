package task_group

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
)

func (r *repository) CountCompletedTasksInGroup(ctx context.Context, groupId int) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("COUNT(*)").From("tasks").
		Where(squirrel.And{
			squirrel.Eq{"group_id": groupId},
			squirrel.Eq{"status": "completed"},
		}).ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var count int
	err = conn.QueryRow(ctx, query, args...).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return count, nil
}
