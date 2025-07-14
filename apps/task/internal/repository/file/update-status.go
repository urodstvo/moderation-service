package file

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) UpdateStatus(ctx context.Context, id int, status gomodels.Status) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Update("files").Set("status", status).Set("updated_at", squirrel.Expr("NOW()")).Where(squirrel.Eq{"id": id}).ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows updated, maybe file with id=%d not found", id)
	}

	return nil
}
