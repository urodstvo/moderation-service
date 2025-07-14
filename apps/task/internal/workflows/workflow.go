package workflows

import (
	"time"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/activities"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.temporal.io/sdk/workflow"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger   logger.Logger
	Activity *activities.Activity
}

type Workflow struct {
	Logger   logger.Logger
	Activity *activities.Activity
}

func New(opts Opts) *Workflow {
	return &Workflow{
		Logger:   opts.Logger,
		Activity: opts.Activity,
	}
}

func (w *Workflow) Flow(ctx workflow.Context, params types.WorkflowParams) (*types.WorkflowResult, error) {
	audioCtx := createChildContext(ctx, constants.AudioWorkflowQueueName)
	audioFuture := workflow.ExecuteChildWorkflow(audioCtx, constants.AudioWorkflowName)

	videoCtx := createChildContext(ctx, constants.VideoWorkflowQueueName)
	videoFuture := workflow.ExecuteChildWorkflow(videoCtx, constants.VideoWorkflowName)

	imageCtx := createChildContext(ctx, constants.ImageWorkflowName)
	imageFuture := workflow.ExecuteChildWorkflow(imageCtx, constants.ImageWorkflowName)

	var imageRes, audioRes, videoRes string
	if err := imageFuture.Get(imageCtx, &imageRes); err != nil {
		return nil, err
	}
	if err := audioFuture.Get(audioCtx, &audioRes); err != nil {
		return nil, err
	}
	if err := videoFuture.Get(videoCtx, &videoRes); err != nil {
		return nil, err
	}

	var combined string
	if err := workflow.ExecuteActivity(ctx, w.Activity.CombineTexts).Get(ctx, &combined); err != nil {
		return nil, err
	}

	var textRes string
	textCtx := createChildContext(ctx, constants.TextWorkflowQueueName)
	if err := workflow.ExecuteChildWorkflow(textCtx, constants.TextWorkflowName).Get(ctx, &textRes); err != nil {
		return nil, err
	}

	var finalResult types.WorkflowResult
	if err := workflow.ExecuteActivity(ctx, w.Activity.AssembleResult).Get(ctx, &finalResult); err != nil {
		return nil, err
	}

	if params.IsAsync {
		if err := workflow.ExecuteActivity(ctx, w.Activity.CallWebhook).Get(ctx, nil); err != nil {
			return nil, err
		}
		return nil, nil
	}

	return &finalResult, nil
}

func createChildContext(ctx workflow.Context, queueName string) workflow.Context {
	childOpts := workflow.ChildWorkflowOptions{
		WorkflowExecutionTimeout: time.Hour,
		TaskQueue:                queueName,
	}
	return workflow.WithChildOptions(ctx, childOpts)
}
