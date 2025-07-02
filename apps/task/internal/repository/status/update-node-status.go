package status

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) UpdateNodeStatus(ctx context.Context, requestId int, status gomodels.Status) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Update("status_nodes").Set("status", status).Where(squirrel.Eq{"request_id": requestId}).ToSql()
	if err != nil {
		return err
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows updated for request_id: %d", requestId)
	}

	return nil
}
