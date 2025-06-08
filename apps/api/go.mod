module github.com/urodstvo/moderation-service/apps/api

go 1.24.2

replace (
	github.com/urodstvo/moderation-service/libs/config => ../../libs/config
	github.com/urodstvo/moderation-service/libs/fx => ../../libs/fx
	github.com/urodstvo/moderation-service/libs/grpc => ../../libs/grpc
	github.com/urodstvo/moderation-service/libs/logger => ../../libs/logger
	github.com/urodstvo/moderation-service/libs/models => ../../libs/models
)

require (
	github.com/danielgtaylor/huma/v2 v2.32.0
	github.com/gin-contrib/cors v1.7.5
	github.com/gin-gonic/gin v1.10.1
	github.com/samber/slog-gin v1.15.1
	github.com/urodstvo/moderation-service/libs/fx v0.0.0-00010101000000-000000000000
	github.com/urodstvo/moderation-service/libs/logger v0.0.0-00010101000000-000000000000
	go.uber.org/fx v1.24.0
)

require (
	github.com/avito-tech/go-transaction-manager/drivers/pgxv5/v2 v2.0.0 // indirect
	github.com/avito-tech/go-transaction-manager/trm/v2 v2.0.0 // indirect
	github.com/bytedance/sonic v1.13.2 // indirect
	github.com/bytedance/sonic/loader v0.2.4 // indirect
	github.com/cloudwego/base64x v0.1.5 // indirect
	github.com/gabriel-vasile/mimetype v1.4.8 // indirect
	github.com/gin-contrib/sse v1.0.0 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.26.0 // indirect
	github.com/goccy/go-json v0.10.5 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/pgx/v5 v5.7.2 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/leodido/go-urn v1.4.0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/pelletier/go-toml/v2 v2.2.3 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/rs/zerolog v1.33.0 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	github.com/samber/slog-multi v1.4.0 // indirect
	github.com/samber/slog-zerolog/v2 v2.7.3 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.12 // indirect
	github.com/urodstvo/moderation-service/libs/config v0.0.0-00010101000000-000000000000 // indirect
	go.opentelemetry.io/otel v1.29.0 // indirect
	go.opentelemetry.io/otel/trace v1.29.0 // indirect
	go.uber.org/dig v1.19.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/arch v0.15.0 // indirect
	golang.org/x/crypto v0.38.0 // indirect
	golang.org/x/net v0.38.0 // indirect
	golang.org/x/sync v0.14.0 // indirect
	golang.org/x/sys v0.33.0 // indirect
	golang.org/x/text v0.25.0 // indirect
	google.golang.org/protobuf v1.36.6 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
