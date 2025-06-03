package webhook

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) (gomodels.Webhook, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("webhooks").Where(squirrel.Eq{"user_id": userId}).ToSql()
	if err != nil {
		return gomodels.Webhook{}, fmt.Errorf("failed to build query: %w", err)
	}

	webhook := gomodels.Webhook{}
	err = conn.QueryRow(ctx, query, args...).Scan(&webhook.UserId, &webhook.WebhookUrl)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.Webhook{}, fmt.Errorf("webhook not found")
		}
		return gomodels.Webhook{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return webhook, nil
}
