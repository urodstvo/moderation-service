package token

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type TaskResultRepository interface {
}

func NewTaskResultRepository(db *pgxpool.Pool) TaskResultRepository {
	return &repository{db: db}
}
