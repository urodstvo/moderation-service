package migrations

import (
	"context"
	"embed"

	"github.com/urodstvo/moderation-service/libs/config"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

//go:embed sql/*.sql
var embedMigrations embed.FS

func main() {
	config, err := config.New()
	if err != nil {
		panic("cannot load config: " + err.Error())
	}

	pool, err := pgxpool.New(context.Background(), config.DatabaseUrl)
	if err != nil {
		panic("failed to open database: " + err.Error())
	}

	db := stdlib.OpenDBFromPool(pool)
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		panic("cannot set dialect: " + err.Error())
	}

	if err := goose.Up(db, "sql", goose.WithAllowMissing()); err != nil {
		panic("cannot to up migrations: " + err.Error())
	}

	// if err := goose.DownTo(db, "sql", 5, goose.WithAllowMissing()); err != nil {
	// 	panic(err)
	// }
}
