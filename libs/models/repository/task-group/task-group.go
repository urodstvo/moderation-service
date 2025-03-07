package token

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type TaskGroupRepository interface {
}

func NewTaskGroupRepository(db *pgxpool.Pool) TaskGroupRepository {
	return &repository{db: db}
}
