package request

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetActive(ctx context.Context, userId int) ([]gomodels.Request, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("requests").Where(squirrel.Eq{"status": "processing"}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return []gomodels.Request{}, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var requests []gomodels.Request
	for rows.Next() {
		request := gomodels.Request{}
		err = rows.Scan(&request.Id, &request.UserId, &request.Status, &request.WorkflowId, &request.RunId, &request.CreatedAt, &request.UpdatedAt, &request.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		requests = append(requests, request)
	}

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []gomodels.Request{}, fmt.Errorf("request not found")
		}
		return []gomodels.Request{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return requests, nil
}
