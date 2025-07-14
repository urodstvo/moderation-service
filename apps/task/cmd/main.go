package main

import (
	"github.com/urodstvo/moderation-service/apps/task/internal/api/http"
	blacklist_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/blacklist"
	file_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/file"
	request_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/request"
	result_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/result"
	status_repo "github.com/urodstvo/moderation-service/apps/task/internal/repository/status"
	blacklist_service "github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	file_service "github.com/urodstvo/moderation-service/apps/task/internal/service/file"
	request_service "github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	result_service "github.com/urodstvo/moderation-service/apps/task/internal/service/result"
	status_service "github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	baseapp "github.com/urodstvo/moderation-service/libs/fx"
	grpc_clients "github.com/urodstvo/moderation-service/libs/grpc/clients"
	"github.com/urodstvo/moderation-service/libs/minio"
	"github.com/urodstvo/moderation-service/libs/server"
	"github.com/urodstvo/moderation-service/libs/server/middlewares"

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
			request_repo.NewRequestRepository,
			file_repo.NewFileRepository,
			result_repo.NewResultRepository,
			status_repo.NewStatusTreeRepository,
			blacklist_repo.NewBlacklistRepository,
		),
		// services
		fx.Provide(
			request_service.NewRequestService,
			file_service.NewFileService,
			result_service.NewResultService,
			status_service.NewStatusTreeService,
			blacklist_service.NewBlacklistService,
		),
		// app itself
		fx.Provide(
			minio.New,
			middlewares.New,
			server.New,
			http.NewHuma,
			grpc_clients.NewGRPCWebhookClient,
		),
		fx.Invoke(),
	).Run()
}
