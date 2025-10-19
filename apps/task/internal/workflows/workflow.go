package workflows

import (
	"time"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/activities"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
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
	createCh := workflow.GetSignalChannel(ctx, constants.CreateStatusSignalName)
	updateCh := workflow.GetSignalChannel(ctx, constants.UpdateStatusSignalName)

	selector := workflow.NewSelector(ctx)
	selector.AddReceive(createCh, func(c workflow.ReceiveChannel, _ bool) {
		var payload map[string]interface{}
		c.Receive(ctx, &payload)
		_ = workflow.ExecuteActivity(ctx, w.Activity.PersistCreateNode, payload).Get(ctx, nil)
	})
	selector.AddReceive(updateCh, func(c workflow.ReceiveChannel, _ bool) {
		var payload map[string]interface{}
		c.Receive(ctx, &payload)
		_ = workflow.ExecuteActivity(ctx, w.Activity.PersistUpdateNodeStatus, payload).Get(ctx, nil)
	})

	stopCh := workflow.NewChannel(ctx)
	workflow.Go(ctx, func(ctx workflow.Context) {
		for {
			selector.Select(ctx)
			var stop bool
			if stopCh.ReceiveAsync(&stop) && stop {
				return
			}
		}
	})
	audioCtx := createChildContext(ctx, constants.AudioWorkflowQueueName)
	audioFuture := workflow.ExecuteChildWorkflow(audioCtx, constants.AudioWorkflowName, params.RequestId, params.UserId, params.Files.Audios)

	videoCtx := createChildContext(ctx, constants.VideoWorkflowQueueName)
	videoFuture := workflow.ExecuteChildWorkflow(videoCtx, constants.VideoWorkflowName, params.RequestId, params.UserId, params.Files.Videos)

	imageCtx := createChildContext(ctx, constants.ImageWorkflowName)
	imageFuture := workflow.ExecuteChildWorkflow(imageCtx, constants.ImageWorkflowName, params.RequestId, params.UserId, params.Files.Images)

	var (
		imageRes []types.ResultItem
		audioRes []types.ResultItem
		videoRes []types.ResultItem
		textRes  []types.TextResultItem
	)
	if err := imageFuture.Get(imageCtx, &imageRes); err != nil {
		return nil, err
	}
	if err := audioFuture.Get(audioCtx, &audioRes); err != nil {
		return nil, err
	}
	if err := videoFuture.Get(videoCtx, &videoRes); err != nil {
		return nil, err
	}

	var textReq []types.ResultItem
	for _, text := range params.Files.Texts {
		textReq = append(textReq, types.ResultItem{Id: text.Id, Filename: text.Filename, RecognizedText: "", ContentType: gomodels.ContentTypeText})
	}

	var combined []types.ResultItem
	if err := workflow.ExecuteActivity(ctx, w.Activity.CombineTexts, [][]types.ResultItem{imageRes, videoRes, audioRes, textReq}).Get(ctx, &combined); err != nil {
		return nil, err
	}

	if err := workflow.ExecuteActivity(ctx, w.Activity.SaveRawResults, params.RequestId, combined).Get(ctx, nil); err != nil {
		return nil, err
	}

	var blacklist []string
	if err := workflow.ExecuteActivity(ctx, w.Activity.GetBlacklist, params.UserId).Get(ctx, &blacklist); err != nil {
		return nil, err
	}

	var settings []gomodels.Settings
	if err := workflow.ExecuteActivity(ctx, w.Activity.GetSettings, params.UserId).Get(ctx, &settings); err != nil {
		return nil, err
	}

	textCtx := createChildContext(ctx, constants.TextWorkflowQueueName)
	if err := workflow.ExecuteChildWorkflow(textCtx, constants.TextWorkflowName, params.RequestId, params.UserId, combined, blacklist, settings).Get(textCtx, &textRes); err != nil {
		return nil, err
	}

	var finalResult types.WorkflowResult
	if err := workflow.ExecuteActivity(ctx, w.Activity.AssembleResult, params.RequestId, textRes).Get(ctx, &finalResult); err != nil {
		return nil, err
	}

	if err := workflow.ExecuteActivity(ctx, w.Activity.SaveFormattedResults, params.RequestId, finalResult).Get(ctx, nil); err != nil {
		return nil, err
	}

	if params.IsAsync {
		if err := workflow.ExecuteActivity(ctx, w.Activity.CallWebhook, params.UserId, finalResult).Get(ctx, nil); err != nil {
			return nil, err
		}
		return nil, nil
	}

	stopCh.Send(ctx, true)

	return &finalResult, nil
}

func createChildContext(ctx workflow.Context, queueName string) workflow.Context {
	childOpts := workflow.ChildWorkflowOptions{
		WorkflowExecutionTimeout: time.Hour,
		TaskQueue:                queueName,
	}
	return workflow.WithChildOptions(ctx, childOpts)
}
