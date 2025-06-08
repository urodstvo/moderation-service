package role

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetRoleById(ctx context.Context, id int) (gomodels.Role, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("roles").Where(squirrel.Eq{"id": id}).ToSql()
	if err != nil {
		return gomodels.Role{}, fmt.Errorf("failed to build query: %w", err)
	}

	t := gomodels.Role{}
	err = conn.QueryRow(ctx, query, args...).Scan(&t.Id, &t.Name, &t.Description)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.Role{}, fmt.Errorf("role not found")
		}
		return gomodels.Role{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
