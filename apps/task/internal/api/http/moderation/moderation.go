// package moderation_routes

// import (
// 	"context"
// 	"net/http"

// 	"github.com/danielgtaylor/huma/v2"
// 	"github.com/minio/minio-go/v7"
// 	"github.com/urodstvo/moderation-service/libs/config"
// 	"github.com/urodstvo/moderation-service/libs/logger"
// 	"github.com/urodstvo/moderation-service/libs/models/service/task"
// 	task_group "github.com/urodstvo/moderation-service/libs/models/service/task-group"
// 	"github.com/urodstvo/moderation-service/libs/nats"
// 	"go.uber.org/fx"
// )

// type handler struct {
// 	BucketName  string
// 	Logger      logger.Logger
// 	MinioClient *minio.Client
// 	Bus         *nats.Bus

// 	TaskService      task.TaskService
// 	TaskGroupService task_group.TaskGroupService
// }

// type Opts struct {
// 	fx.In

// 	Config           config.Config
// 	Huma             huma.API
// 	Logger           logger.Logger
// 	MinioClient      *minio.Client
// 	Bus              *nats.Bus
// 	TaskService      task.TaskService
// 	TaskGroupService task_group.TaskGroupService
// }

// func NewModerationRoutes(opts Opts) handler {
// 	a := handler{
// 		Logger:           opts.Logger,
// 		TaskService:      opts.TaskService,
// 		TaskGroupService: opts.TaskGroupService,
// 		MinioClient:      opts.MinioClient,
// 		Bus:              opts.Bus,
// 		BucketName:       opts.Config.S3Bucket,
// 	}

// 	huma.Register(
// 		opts.Huma,
// 		huma.Operation{
// 			OperationID: "moderation",
// 			Method:      http.MethodPost,
// 			Path:        "/moderation",
// 			Tags:        []string{"Moderation"},
// 			Summary:     "Moderation",
// 		},
// 		func(ctx context.Context, i *createTasksRequest) (*createTasksResponse, error) {
// 			return a.CreateTasks(ctx, *i)
// 		},
// 	)

// 	return a
// }
