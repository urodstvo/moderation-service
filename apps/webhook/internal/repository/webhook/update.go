package webhook

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	internal_errors "github.com/urodstvo/moderation-service/apps/webhook/internal/errors"
)

func (r *repository) Update(ctx context.Context, webhookUrl string, userId int) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	updateWebhookQuery := sq.Update("webhooks").Set("webhook_url", webhookUrl).Where(squirrel.Eq{"user_id": userId})
	query, args, err := updateWebhookQuery.ToSql()
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
