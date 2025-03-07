module github.com/urodstvo/moderation-service/libs/fx

go 1.23.2

replace (
	github.com/urodstvo/moderation-service/libs/config => ../config
	github.com/urodstvo/moderation-service/libs/logger => ../logger
	github.com/urodstvo/moderation-service/libs/nats => ../nats
)

require (
	github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2 v2.0.0
	github.com/avito-tech/go-transaction-manager/trm/v2 v2.0.0
	github.com/jackc/pgx/v5 v5.7.2
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/logger v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/nats v0.0.0-00010101000000-000000000000
	go.uber.org/fx v1.23.0
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.17.9 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.19 // indirect
	github.com/nats-io/nats.go v1.39.1 // indirect
	github.com/nats-io/nkeys v0.4.9 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rs/zerolog v1.33.0 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	github.com/samber/slog-multi v1.4.0 // indirect
	github.com/samber/slog-zerolog/v2 v2.7.3 // indirect
	go.uber.org/dig v1.18.0 // indirect
	go.uber.org/multierr v1.10.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/crypto v0.31.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.28.0 // indirect
	golang.org/x/text v0.21.0 // indirect
)
