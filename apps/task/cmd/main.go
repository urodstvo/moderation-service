package main

import (
	"github.com/urodstvo/moderation-service/apps/task/internal/grpc"
	blacklist_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/blacklist"
	status_tree_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/status-tree"
	task_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/task"
	task_group_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/task-group"
	task_result_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/task-result"
	blacklist_service "github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	status_tree_service "github.com/urodstvo/moderation-service/apps/task/internal/service/status-tree"
	task_service "github.com/urodstvo/moderation-service/apps/task/internal/service/task"
	task_group_service "github.com/urodstvo/moderation-service/apps/task/internal/service/task-group"
	task_result_service "github.com/urodstvo/moderation-service/apps/task/internal/service/task-result"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	"github.com/urodstvo/moderation-service/libs/minio"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		baseapp.CreateBaseApp(
			baseapp.Opts{
				AppName: "Task Service",
			},
		),
		// repositories
		fx.Provide(
			task_group_repo.NewTaskGroupRepository,
			task_repo.NewTaskRepository,
			task_result_repo.NewTaskResultRepository,
			status_tree_repo.NewStatusTreeRepository,
			blacklist_repo.NewBlacklistRepository,
		),
		// services
		fx.Provide(
			task_group_service.NewTaskGroupService,
			task_service.NewTaskService,
			task_result_service.NewTaskResultService,
			status_tree_service.NewStatusTreeService,
			blacklist_service.NewBlacklistService,
		),
		// app itself
		fx.Provide(
			minio.New,
		),
		fx.Invoke(
			grpc.New,
		),
	).Run()
}
