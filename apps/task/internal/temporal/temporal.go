package temporal

import (
	"context"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/activities"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/constants"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/log"
	"go.temporal.io/sdk/worker"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In
	Lc fx.Lifecycle

	Config     config.Config
	Logger     logger.Logger
	Workflow   *workflows.Workflow
	Activities *activities.Activity
}

func NewMainWorker(opts Opts) error {
	c, err := client.Dial(
		client.Options{
			HostPort: opts.Config.TemporalHost,
			Logger:   log.NewStructuredLogger(opts.Logger.GetSlog()),
		},
	)
	if err != nil {
		return err
	}

	temporalWorker := worker.New(c, constants.WorkerQueueName, worker.Options{})
	temporalWorker.RegisterWorkflow(opts.Workflow.Flow)
	temporalWorker.RegisterActivity(opts.Activities.AssembleResult)
	temporalWorker.RegisterActivity(opts.Activities.CallWebhook)
	temporalWorker.RegisterActivity(opts.Activities.CombineTexts)
	temporalWorker.RegisterActivity(opts.Activities.GetBlacklist)

	opts.Lc.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				return temporalWorker.Start()
			},
			OnStop: func(ctx context.Context) error {
				temporalWorker.Stop()
				return nil
			},
		},
	)

	return nil
}
