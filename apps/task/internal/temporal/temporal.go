package temporal

import (
	"context"
	"fmt"

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
	hostPort := fmt.Sprintf("%s:%d", opts.Config.TemporalHost, opts.Config.TemporalPort)
	c, err := client.Dial(
		client.Options{
			HostPort: hostPort,
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
	temporalWorker.RegisterActivity(opts.Activities.SaveRawResults)
	temporalWorker.RegisterActivity(opts.Activities.SaveFormattedResults)
	temporalWorker.RegisterActivity(opts.Activities.GetSettings)

	opts.Lc.Append(
		fx.Hook{
			OnStart: func(ctx context.Context) error {
				opts.Logger.Info("Main Worker starting...")
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
