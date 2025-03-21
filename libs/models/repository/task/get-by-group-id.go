package task

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByGroupId(ctx context.Context, groupId int) ([]*gomodels.Task, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("tasks").
		Where(squirrel.Eq{"group_id": groupId}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()

	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var tasks []*gomodels.Task
	for rows.Next() {
		task := &gomodels.Task{}
		err = rows.Scan(
			&task.Id, &task.GroupId, &task.Status, &task.ContentType,
			&task.FilePath, &task.CreatedAt, &task.UpdatedAt, &task.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error while iterating over rows: %w", err)
	}

	return tasks, nil
}
