package webhook

import (
	"context"
	"fmt"

	internal_errors "github.com/urodstvo/moderation-service/apps/webhook/internal/errors"
)

func (r *repository) Create(ctx context.Context, webhookUrl string, userId int) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	createWebhookQuery := sq.Insert("webhooks").Columns("user_id", "webhook_url").Values(userId, webhookUrl)
	query, args, err := createWebhookQuery.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return internal_errors.ErrNoRowsAffected
	}

	return nil
}
