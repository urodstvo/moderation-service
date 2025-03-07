package token

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type TokenRepository interface {
}

func NewTokenRepository(db *pgxpool.Pool) TokenRepository {
	return &repository{db: db}
}
