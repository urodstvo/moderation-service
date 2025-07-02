package result

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByRequestId(ctx context.Context, requestId int) (gomodels.RequestResult, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("results").Where(squirrel.Eq{"request_id": requestId}).ToSql()
	if err != nil {
		return gomodels.RequestResult{}, fmt.Errorf("failed to build query: %w", err)
	}

	t := gomodels.RequestResult{}
	err = conn.QueryRow(ctx, query, args...).Scan(&t.RequestId, &t.Raw, &t.Formatted)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.RequestResult{}, fmt.Errorf("request result not found")
		}
		return gomodels.RequestResult{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return t, nil
}
