module github.com/urodstvo/moderation-service/apps/task

go 1.24.2

replace (
	github.com/urodstvo/moderation-service/libs/config => ../../libs/config
	github.com/urodstvo/moderation-service/libs/fx => ../../libs/fx
	github.com/urodstvo/moderation-service/libs/grpc => ../../libs/grpc
	github.com/urodstvo/moderation-service/libs/logger => ../../libs/logger
	github.com/urodstvo/moderation-service/libs/minio => ../../libs/minio
	github.com/urodstvo/moderation-service/libs/models => ../../libs/models
	github.com/urodstvo/moderation-service/libs/nats => ../../libs/nats
)

require (
	github.com/Masterminds/squirrel v1.5.4
	github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2 v2.0.0
	github.com/danielgtaylor/huma/v2 v2.31.0
	github.com/jackc/pgx/v5 v5.7.2
	github.com/urodstvo/moderation-service/apps/task-agregator v0.0.0-20250601091159-ef9dadd37e31
	github.com/urodstvo/moderation-service/libs/fx v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/grpc v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/logger v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/minio v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/models v0.0.0-00010101000000-000000000000
	go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc v0.61.0
	go.uber.org/fx v1.23.0
	google.golang.org/grpc v1.73.0
)

require (
	github.com/avito-tech/go-transaction-manager/trm/v2 v2.0.0 // indirect
	github.com/dustin/go-humanize v1.0.1 // indirect
	github.com/go-ini/ini v1.67.0 // indirect
	github.com/go-logr/logr v1.4.2 // indirect
	github.com/go-logr/stdr v1.2.2 // indirect
	github.com/goccy/go-json v0.10.5 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/lann/builder v0.0.0-20180802200727-47ae307949d0 // indirect
	github.com/lann/ps v0.0.0-20150810152359-62de8c46ede0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/minio/crc64nvme v1.0.1 // indirect
	github.com/minio/md5-simd v1.1.2 // indirect
	github.com/minio/minio-go/v7 v7.0.89 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rs/xid v1.6.0 // indirect
	github.com/rs/zerolog v1.33.0 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	github.com/samber/slog-multi v1.4.0 // indirect
	github.com/samber/slog-zerolog/v2 v2.7.3 // indirect
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000 // indirect
	go.opentelemetry.io/auto/sdk v1.1.0 // indirect
	go.opentelemetry.io/otel v1.36.0 // indirect
	go.opentelemetry.io/otel/metric v1.36.0 // indirect
	go.opentelemetry.io/otel/trace v1.36.0 // indirect
	go.uber.org/dig v1.18.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/crypto v0.38.0 // indirect
	golang.org/x/net v0.40.0 // indirect
	golang.org/x/sync v0.14.0 // indirect
	golang.org/x/sys v0.33.0 // indirect
	golang.org/x/text v0.25.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250519155744-55703ea1f237 // indirect
	google.golang.org/protobuf v1.36.6 // indirect
)
