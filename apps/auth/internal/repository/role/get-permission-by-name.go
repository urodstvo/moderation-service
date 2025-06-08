package role

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetPermissionByName(ctx context.Context, role string) (gomodels.Permission, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("permissions").Where(squirrel.Eq{"name": role}).ToSql()
	if err != nil {
		return gomodels.Permission{}, fmt.Errorf("failed to build query: %w", err)
	}

	t := gomodels.Permission{}
	err = conn.QueryRow(ctx, query, args...).Scan(&t.Id, &t.Name, &t.Description)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.Permission{}, fmt.Errorf("role not found")
		}
		return gomodels.Permission{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
