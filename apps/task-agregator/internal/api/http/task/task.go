package task_routes

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/models/service/task"
	task_group "github.com/urodstvo/moderation-service/libs/models/service/task-group"
	"go.uber.org/fx"
)

type handler struct {
	Logger logger.Logger

	TaskService      task.TaskService
	TaskGroupService task_group.TaskGroupService
}

type Opts struct {
	fx.In

	Huma             huma.API
	Logger           logger.Logger
	TaskService      task.TaskService
	TaskGroupService task_group.TaskGroupService
}

func NewTaskRoutes(opts Opts) handler {
	a := handler{
		Logger:           opts.Logger,
		TaskService:      opts.TaskService,
		TaskGroupService: opts.TaskGroupService,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "task-check",
			Method:      http.MethodGet,
			Path:        "/task/{groupId}",
			Tags:        []string{"Task"},
			Summary:     "Tasks Status Check",
		},
		func(ctx context.Context, i *checkRequest) (*checkResponse, error) {
			return a.Check(ctx, *i)
		},
	)

	return a
}
