package user

import (
	"context"
	"fmt"
)

func (r *repository) Create(ctx context.Context, email string, password string) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	createUserQuery := sq.Insert("users").Columns("email", "password").Values(email, password).Suffix("RETURNING id")
	query, args, err := createUserQuery.ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var userID int
	err = conn.QueryRow(ctx, query, args...).Scan(&userID)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return userID, nil
}
