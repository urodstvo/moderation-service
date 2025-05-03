module github.com/urodstvo/moderation-service/apps/task-agregator

go 1.23.2

replace (
	github.com/urodstvo/moderation-service/libs/config => ../../libs/config
	github.com/urodstvo/moderation-service/libs/fx => ../../libs/fx
	github.com/urodstvo/moderation-service/libs/logger => ../../libs/logger
	github.com/urodstvo/moderation-service/libs/minio => ../../libs/minio
	github.com/urodstvo/moderation-service/libs/models => ../../libs/models
	github.com/urodstvo/moderation-service/libs/nats => ../../libs/nats
)

require (
	github.com/danielgtaylor/huma/v2 v2.31.0
	github.com/gin-contrib/cors v1.7.3
	github.com/gin-gonic/gin v1.10.0
	github.com/minio/minio-go/v7 v7.0.89
	github.com/samber/slog-gin v1.14.1
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/fx v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/logger v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/minio v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/models v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/nats v0.0.0-00010101000000-000000000000
	go.uber.org/fx v1.23.0
)

require (
	github.com/Masterminds/squirrel v1.5.4 // indirect
	github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2 v2.0.0 // indirect
	github.com/avito-tech/go-transaction-manager/trm/v2 v2.0.0 // indirect
	github.com/bytedance/sonic v1.12.6 // indirect
	github.com/bytedance/sonic/loader v0.2.1 // indirect
	github.com/cloudwego/base64x v0.1.4 // indirect
	github.com/cloudwego/iasm v0.2.0 // indirect
	github.com/dustin/go-humanize v1.0.1 // indirect
	github.com/gabriel-vasile/mimetype v1.4.7 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-ini/ini v1.67.0 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.23.0 // indirect
	github.com/goccy/go-json v0.10.5 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/pgx/v5 v5.7.2 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/lann/builder v0.0.0-20180802200727-47ae307949d0 // indirect
	github.com/lann/ps v0.0.0-20150810152359-62de8c46ede0 // indirect
	github.com/leodido/go-urn v1.4.0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/minio/crc64nvme v1.0.1 // indirect
	github.com/minio/md5-simd v1.1.2 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/nats-io/nats.go v1.39.1 // indirect
	github.com/nats-io/nkeys v0.4.9 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	github.com/pelletier/go-toml/v2 v2.2.3 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rs/xid v1.6.0 // indirect
	github.com/rs/zerolog v1.33.0 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	github.com/samber/slog-multi v1.4.0 // indirect
	github.com/samber/slog-zerolog/v2 v2.7.3 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.12 // indirect
	go.opentelemetry.io/otel v1.29.0 // indirect
	go.opentelemetry.io/otel/trace v1.29.0 // indirect
	go.uber.org/dig v1.18.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/arch v0.12.0 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/net v0.37.0 // indirect
	golang.org/x/sync v0.12.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
	google.golang.org/protobuf v1.36.1 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
