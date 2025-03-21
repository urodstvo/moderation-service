package token

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByToken(ctx context.Context, token string) (*gomodels.Token, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.
		Select("*").From("tokens").Where(squirrel.Eq{"token": token}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	var t gomodels.Token
	err = conn.QueryRow(ctx, query, args...).Scan(&t.UserId, &t.Token)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("token not found")
		}
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	return &t, nil
}
