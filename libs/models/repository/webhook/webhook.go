package token

import (
	"context"

	trmpgx "github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

type repository struct {
	db     *pgxpool.Pool
	getter *trmpgx.CtxGetter
}

type WebhookRepository interface {
	Create(ctx context.Context, token string, userId int) error
	GetByUserId(ctx context.Context, userId int) (*gomodels.Webhook, error)
}

func NewWebhookRepository(db *pgxpool.Pool) WebhookRepository {
	return &repository{
		db:     db,
		getter: trmpgx.DefaultCtxGetter,
	}
}

func (r *repository) Create(ctx context.Context, token string, userId int) error {
	return nil
}

func (r *repository) GetByUserId(ctx context.Context, userId int) (*gomodels.Webhook, error) {
	return nil, nil
}
