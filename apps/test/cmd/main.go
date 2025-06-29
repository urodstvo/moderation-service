package main

import (
	"github.com/urodstvo/moderation-service/apps/test/internal/api/http"
	"github.com/urodstvo/moderation-service/apps/test/internal/api/http/routes/webhook"
	"github.com/urodstvo/moderation-service/apps/test/internal/api/http/sse"
	"github.com/urodstvo/moderation-service/apps/test/internal/hub"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	"github.com/urodstvo/moderation-service/libs/server"
	"github.com/urodstvo/moderation-service/libs/server/middlewares"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Test Service",
			},
		),
		// repositories
		fx.Provide(),
		// services
		fx.Provide(),
		// app itself
		fx.Provide(
			hub.New,
			middlewares.New,
			server.New,
			http.NewHuma,
		),
		fx.Invoke(
			webhook.New,
			sse.New,
		),
	).Run()
}
