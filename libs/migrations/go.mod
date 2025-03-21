module github.com/urodstvo/moderation-service/libs/migrations

go 1.23.2

replace github.com/urodstvo/moderation-service/libs/config => ../config

require (
	github.com/jackc/pgx/v5 v5.7.2
	github.com/pressly/goose/v3 v3.24.1
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/mfridman/interpolate v0.0.2 // indirect
	github.com/sethvargo/go-retry v0.3.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	golang.org/x/crypto v0.31.0 // indirect
	golang.org/x/sync v0.12.0 // indirect
	golang.org/x/text v0.21.0 // indirect
)
