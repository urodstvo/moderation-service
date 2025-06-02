package listener

import (
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/urodstvo/moderation-service/apps/result-agregator/internal/helpers"
	"github.com/urodstvo/moderation-service/apps/result-agregator/internal/result"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/models/service/task"
	task_group "github.com/urodstvo/moderation-service/libs/models/service/task-group"
	task_result "github.com/urodstvo/moderation-service/libs/models/service/task-result"
	"github.com/urodstvo/moderation-service/libs/models/service/webhook"
	"github.com/urodstvo/moderation-service/libs/nats"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In
	LC fx.Lifecycle

	Logger logger.Logger
	Bus    *nats.Bus
	Config config.Config

	Webhook     webhook.WebhookService
	Task        task.TaskService
	TaskGroup   task_group.TaskGroupService
	TaskResult  task_result.TaskResultService
	MinioClient *minio.Client
}

type BusListener struct {
	logger      logger.Logger
	bus         *nats.Bus
	config      config.Config
	webhook     webhook.WebhookService
	task        task.TaskService
	taskGroup   task_group.TaskGroupService
	taskResult  task_result.TaskResultService
	minioClient *minio.Client
}

func New(opts Opts) (*BusListener, error) {
	listener := &BusListener{
		logger:      opts.Logger,
		config:      opts.Config,
		bus:         opts.Bus,
		webhook:     opts.Webhook,
		task:        opts.Task,
		taskGroup:   opts.TaskGroup,
		taskResult:  opts.TaskResult,
		minioClient: opts.MinioClient,
	}

	opts.LC.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				listener.bus.TaskDone.SubscribeGroup("tasks", listener.handleTaskDone)

				return nil
			},
			OnStop: func(ctx context.Context) error {
				listener.bus.TaskDone.Unsubscribe()

				return nil
			},
		},
	)

	return listener, nil
}

func (c *BusListener) handleTaskDone(ctx context.Context, req nats.TaskDone) struct{} {
	c.logger.Info(fmt.Sprintf("Processing completed task: ID=%d", req.TaskId))

	task, err := c.task.GetById(ctx, req.TaskId)
	if err != nil {
		c.logger.Error(fmt.Sprintf("Failed to get task: %v", err))
		return struct{}{}
	}

	err = c.task.UpdateStatus(ctx, req.TaskId, "completed")
	if err != nil {
		c.logger.Error(fmt.Sprintf("Failed to update task status: %v", err))
		return struct{}{}
	}

	return c.processTaskGroup(ctx, task.GroupId)
}

func (c *BusListener) processTaskGroup(ctx context.Context, groupId int) struct{} {
	taskGroup, err := c.taskGroup.GetById(ctx, groupId)
	if err != nil {
		c.logger.Error(fmt.Sprintf("Failed to get task group: %v", err))
		return struct{}{}
	}

	allCompleted, err := c.taskGroup.AreAllTasksCompleted(ctx, taskGroup.Id)
	if err != nil {
		c.logger.Error(fmt.Sprintf("Failed to check task group completion: %v", err))
		return struct{}{}
	}

	if allCompleted {
		err = c.taskGroup.UpdateStatus(ctx, taskGroup.Id, "completed")
		if err != nil {
			c.logger.Error(fmt.Sprintf("Failed to update task group status: %v", err))
			return struct{}{}
		}

		var allResults []map[string]any
		tasks, err := c.task.GetByGroupId(ctx, taskGroup.Id)
		if err != nil {
			c.logger.Error(fmt.Sprintf("Failed to get tasks by group ID: %v", err))
			return struct{}{}
		}

		for _, t := range tasks {
			taskResult, err := c.taskResult.GetByTaskId(ctx, t.Id)
			if err != nil {
				c.logger.Error(fmt.Sprintf("Failed to get task result for TaskID=%d: %v", t.Id, err))
				return struct{}{}
			}
			_ = c.minioClient.RemoveObject(ctx, c.config.S3Bucket, helpers.ExtractFilenameFromURL(t.FilePath), minio.RemoveObjectOptions{})

			converted, _ := result.Convert(taskResult.Content, t.Id, t.ContentType)
			allResults = append(allResults, converted)
		}

		payload, err := result.CollectResults(*taskGroup, allResults)
		if err != nil {
			c.logger.Error(fmt.Sprintf("Failed to collect results: %v", err))
			return struct{}{}
		}

		// webhook, err := c.webhook.GetByUserId(ctx, taskGroup.UserId)
		// if err == nil {
		// 	err = result.SendResults(ctx, webhook.WebhookUrl, payload)
		// 	if err != nil {
		// 		c.logger.Error(fmt.Sprintf("Failed to send results: %v", err))
		// 		return struct{}{}
		// 	}
		// }

		c.logger.Info("payload", payload)

	}

	return struct{}{}
}
