package user

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetById(ctx context.Context, id int) (gomodels.User, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("users").Where(squirrel.Eq{"id": id}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return gomodels.User{}, fmt.Errorf("failed to build query: %w", err)
	}

	user := gomodels.User{}
	err = conn.QueryRow(ctx, query, args...).Scan(&user.Id, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt, &user.IsVerified, &user.Role)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.User{}, fmt.Errorf("user not found")
		}
		return gomodels.User{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return user, nil
}
