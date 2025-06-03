package status_tree

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetRelationsByTaskId(ctx context.Context, taskId int) ([]gomodels.TaskStatusNodeRelation, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").
		From("task_status_node_relations").
		Where(squirrel.Eq{"task_id": taskId}).ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var relations []gomodels.TaskStatusNodeRelation
	for rows.Next() {
		var relation gomodels.TaskStatusNodeRelation
		if err := rows.Scan(&relation.TaskId, &relation.ParentKey, &relation.ChildKey); err != nil {
			return nil, err
		}
		relations = append(relations, relation)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return relations, nil
}
