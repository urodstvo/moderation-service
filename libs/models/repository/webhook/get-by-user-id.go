package webhook

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) (*gomodels.Webhook, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("webhooks").Where(squirrel.Eq{"user_id": userId}).Where(squirrel.Expr("deleted_at IS NULL")).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	var webhook gomodels.Webhook
	err = conn.QueryRow(ctx, query, args...).Scan(&webhook.UserId, &webhook.WebhookUrl)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("webhook not found")
		}
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	return &webhook, nil
}
