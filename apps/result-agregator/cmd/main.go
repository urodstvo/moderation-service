package main

import (
	"github.com/urodstvo/moderation-service/apps/result-agregator/internal/listener"
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
				AppName: "Result Agregator Service",
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
		),
		fx.Invoke(
			listener.New,
		),
	).Run()
}
