package result

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
)

func (r *repository) UpdateFormatted(ctx context.Context, requestId int, result string) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.
		Update("results").
		Set("formatted", result).
		Where(squirrel.Eq{"request_id": requestId}).
		ToSql()
	if err != nil {
		return fmt.Errorf("build update query: %w", err)
	}

	res, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute update query: %w", err)
	}

	if res.RowsAffected() == 0 {
		return fmt.Errorf("no rows updated for request_id=%d", requestId)
	}

	return nil
}
