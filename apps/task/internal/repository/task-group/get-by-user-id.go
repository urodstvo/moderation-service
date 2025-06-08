package task_group

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) (gomodels.TaskGroup, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("task_groups").Where(squirrel.Eq{"user_id": userId}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return gomodels.TaskGroup{}, fmt.Errorf("failed to build query: %w", err)
	}

	t := gomodels.TaskGroup{}
	err = conn.QueryRow(ctx, query, args...).
		Scan(&t.Id, &t.UserId, &t.Status, &t.CreatedAt, &t.UpdatedAt, &t.DeletedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.TaskGroup{}, fmt.Errorf("task_group not found")
		}
		return gomodels.TaskGroup{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
