package result

import (
	"context"
	"fmt"
)

func (r *repository) Create(ctx context.Context, requestId int, raw string) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("results").Columns("request_id", "raw").Values(requestId, raw).ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows inserted")
	}

	return nil
}
