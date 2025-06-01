module github.com/urodstvo/moderation-service/libs/minio

go 1.23.2

replace (
	github.com/urodstvo/moderation-service/libs/config => ../../libs/config
	github.com/urodstvo/moderation-service/libs/fx => ../../libs/fx
	github.com/urodstvo/moderation-service/libs/logger => ../../libs/logger
	github.com/urodstvo/moderation-service/libs/models => ../../libs/models
	github.com/urodstvo/moderation-service/libs/nats => ../../libs/nats
)

require (
	github.com/minio/minio-go/v7 v7.0.89
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/logger v0.0.0-00010101000000-000000000000
	go.uber.org/fx v1.23.0
)

require (
	github.com/dustin/go-humanize v1.0.1 // indirect
	github.com/go-ini/ini v1.67.0 // indirect
	github.com/goccy/go-json v0.10.5 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/minio/crc64nvme v1.0.1 // indirect
	github.com/minio/md5-simd v1.1.2 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rs/xid v1.6.0 // indirect
	github.com/rs/zerolog v1.33.0 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	github.com/samber/slog-multi v1.4.0 // indirect
	github.com/samber/slog-zerolog/v2 v2.7.3 // indirect
	go.uber.org/dig v1.18.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/net v0.37.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
)
