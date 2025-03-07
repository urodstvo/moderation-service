package user

import "github.com/jackc/pgx/v5/pgxpool"

type repository struct {
	db *pgxpool.Pool
}

type UserRepository interface {
}

func NewUsersRepository(db *pgxpool.Pool) UserRepository {
	return &repository{db: db}
}
