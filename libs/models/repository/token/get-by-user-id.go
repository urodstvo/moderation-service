package token

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) (gomodels.Token, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("tokens").Where(squirrel.Eq{"user_id": userId}).ToSql()
	if err != nil {
		return gomodels.Token{}, fmt.Errorf("failed to build query: %w", err)
	}

	t := gomodels.Token{}
	err = conn.QueryRow(ctx, query, args...).Scan(&t.UserId, &t.Token)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.Token{}, fmt.Errorf("token not found")
		}
		return gomodels.Token{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
