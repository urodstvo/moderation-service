module github.com/urodstvo/moderation-service/libs/logger

go 1.23.2

replace github.com/urodstvo/moderation-service/libs/config => ../config

require (
	github.com/rs/zerolog v1.33.0
	github.com/samber/slog-multi v1.4.0
	github.com/samber/slog-zerolog/v2 v2.7.3
	go.uber.org/fx v1.23.0
	go.uber.org/zap v1.27.0
)

require (
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/samber/lo v1.49.1 // indirect
	github.com/samber/slog-common v0.18.1 // indirect
	go.uber.org/dig v1.18.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
)
