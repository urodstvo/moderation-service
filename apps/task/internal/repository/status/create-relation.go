package status

import (
	"context"
	"fmt"

	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) CreateRelation(ctx context.Context, relation gomodels.StatusNodeRelation) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("status_node_relations").
		Columns("request_id", "parent_id", "parent_id").
		Values(relation.RequestId, relation.ParentId, relation.ChildId).ToSql()

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
