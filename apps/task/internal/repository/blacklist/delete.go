package blacklist

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
)

func (r *repository) Delete(ctx context.Context, id int) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Delete("blacklists").Where(squirrel.Eq{"id": id}).ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows deleted for id %d", id)
	}

	return nil
}
