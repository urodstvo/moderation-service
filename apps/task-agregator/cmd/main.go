package main

import (
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/api/http"
	testroute "github.com/urodstvo/moderation-service/apps/task-agregator/internal/api/http/test"
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/server"
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/server/middlewares"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Task Agregator Service",
			},
		),
		// repositories
		fx.Provide(),
		// services
		fx.Provide(),
		// app itself
		fx.Provide(
			middlewares.New,
			server.New,
			http.NewHuma,
		),
		fx.Invoke(
			testroute.NewTestRoutes,
		),
	).Run()
}
