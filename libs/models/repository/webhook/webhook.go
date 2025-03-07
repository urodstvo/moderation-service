package token

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type WebhookRepository interface {
}

func NewWebhookRepository(db *pgxpool.Pool) WebhookRepository {
	return &repository{db: db}
}
