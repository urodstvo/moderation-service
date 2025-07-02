package status

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetRelationsByRequestId(ctx context.Context, RequestId int) ([]gomodels.StatusNodeRelation, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("status_node_relations").Where(squirrel.Eq{"request_id": RequestId}).ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var relations []gomodels.StatusNodeRelation
	for rows.Next() {
		var relation gomodels.StatusNodeRelation
		if err := rows.Scan(&relation.RequestId, &relation.ParentId, &relation.ChildId); err != nil {
			return nil, err
		}
		relations = append(relations, relation)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return relations, nil
}
