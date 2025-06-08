package main

import (
	"github.com/urodstvo/moderation-service/apps/api/internal/api/http"
	"github.com/urodstvo/moderation-service/apps/api/internal/server"
	"github.com/urodstvo/moderation-service/apps/api/internal/server/middlewares"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "API GATEWAY",
			},
		),
		// repositories
		fx.Provide(
			middlewares.New,
			server.New,
			http.NewHuma,
		),
		fx.Invoke(),
	).Run()
}
