package main

import (
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/api/http"
	moderation_routes "github.com/urodstvo/moderation-service/apps/task-agregator/internal/api/http/moderation"
	webhook_routes "github.com/urodstvo/moderation-service/apps/task-agregator/internal/api/http/webhook"
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/server"
	"github.com/urodstvo/moderation-service/apps/task-agregator/internal/server/middlewares"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	"github.com/urodstvo/moderation-service/libs/minio"
	task_repo "github.com/urodstvo/moderation-service/libs/models/repository/task"
	task_group_repo "github.com/urodstvo/moderation-service/libs/models/repository/task-group"
	webhook_repo "github.com/urodstvo/moderation-service/libs/models/repository/webhook"
	task_service "github.com/urodstvo/moderation-service/libs/models/service/task"
	task_group_service "github.com/urodstvo/moderation-service/libs/models/service/task-group"
	webhook_service "github.com/urodstvo/moderation-service/libs/models/service/webhook"

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
		fx.Provide(
			task_group_repo.NewTaskGroupRepository,
			task_repo.NewTaskRepository,
			webhook_repo.NewWebhookRepository,
		),
		// services
		fx.Provide(
			task_group_service.NewTaskGroupService,
			task_service.NewTaskService,
			webhook_service.NewWebhookService,
		),
		// app itself
		fx.Provide(
			minio.New,
			middlewares.New,
			server.New,
			http.NewHuma,
		),
		fx.Invoke(
			webhook_routes.NewWebhookRoutes,
			moderation_routes.NewModerationRoutes,
		),
	).Run()
}
