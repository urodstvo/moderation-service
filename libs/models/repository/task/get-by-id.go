package task

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetById(ctx context.Context, id int) (*gomodels.Task, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("tasks").Where(squirrel.Eq{"id": id}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	var t gomodels.Task
	err = conn.QueryRow(ctx, query, args...).Scan(&t.Id, &t.GroupId, &t.Status, &t.ContentType, &t.FilePath, &t.CreatedAt, &t.UpdatedAt, &t.DeletedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("task not found")
		}
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	return &t, nil

}
