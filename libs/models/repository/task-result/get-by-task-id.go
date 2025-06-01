package task_result

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByTaskId(ctx context.Context, taskId int) (*gomodels.TaskResult, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("task_results").Where(squirrel.Eq{"task_id": taskId}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	var t gomodels.TaskResult
	err = conn.QueryRow(ctx, query, args...).Scan(&t.TaskId, &t.Content)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("task_result not found")
		}
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	return &t, nil
}
