package request

import (
	"context"
	"fmt"
)

func (r *repository) Create(ctx context.Context, userId int) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("requests").Columns("user_id").Values(userId).Suffix("RETURNING id").ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var groupID int
	err = conn.QueryRow(ctx, query, args...).Scan(&groupID)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return groupID, nil
}
