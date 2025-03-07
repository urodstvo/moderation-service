package token

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type TaskRepository interface {
}

func NewTaskRepository(db *pgxpool.Pool) TaskRepository {
	return &repository{db: db}
}
