package request

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
)

func (r *repository) UpdateFlowData(ctx context.Context, id int, workflowId, runId string) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Update("requests").Set("workflow_id", workflowId).Set("run_id", runId).Set("updated_at", squirrel.Expr("NOW()")).
		Where(squirrel.Eq{"id": id}).ToSql()

	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows updated, maybe request with id=%d not found", id)
	}

	return nil
}
