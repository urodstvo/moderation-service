package workflows

import (
	"context"
	"time"

	"github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/activities"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/constants"
	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger   logger.Logger
	Activity *activities.Activity
	Request  request.RequestService
}

type Workflow struct {
	Logger   logger.Logger
	Activity *activities.Activity
	Request  request.RequestService
}

func New(opts Opts) *Workflow {
	return &Workflow{
		Logger:   opts.Logger,
		Activity: opts.Activity,
		Request:  opts.Request,
	}
}

func (w *Workflow) Flow(ctx workflow.Context, params types.WorkflowParams) (*types.WorkflowResult, error) {
	w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusProcessing)
	
	ctx = workflow.WithActivityOptions(ctx, workflow.ActivityOptions{
		StartToCloseTimeout:    time.Minute * 10,
		ScheduleToCloseTimeout: time.Minute * 15, // опционально, но надёжнее
		HeartbeatTimeout:       time.Second * 30,
		RetryPolicy:            &temporal.RetryPolicy{MaximumAttempts: 3},
	})

	// === Сигналы ===
	stopCh := workflow.NewChannel(ctx)

	selector := workflow.NewSelector(ctx)
	selector.AddReceive(stopCh, func(c workflow.ReceiveChannel, _ bool) {})

	// === Запуск сигнального цикла ===
	workflow.Go(ctx, func(gctx workflow.Context) {
		for {
			selector.Select(gctx)
			var stop bool
			if stopCh.ReceiveAsync(&stop) && stop {
				workflow.GetLogger(gctx).Info("Stop signal received")
				return
			}
		}
	})

	var videoExtractedAudios []types.FileTypeParams
	if len(params.Files.Videos) > 0 {
		videoCtx, cancel := createChildContext(ctx, constants.VideoWorkflowQueueName)
		defer cancel()

		future := workflow.ExecuteChildWorkflow(
			videoCtx,
			constants.VideoWorkflowName,
			params.RequestId,
			params.UserId,
			params.Files.Videos,
		)

		err := future.Get(ctx, &videoExtractedAudios)
		if err != nil {
			w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
			return nil, err
		}
	} else {
		videoExtractedAudios = []types.FileTypeParams{}
	}

	audioInputFiles := make([]types.FileTypeParams, 0, len(params.Files.Audios)+len(videoExtractedAudios))
	audioInputFiles = append(audioInputFiles, params.Files.Audios...)
	audioInputFiles = append(audioInputFiles, videoExtractedAudios...)

	var (
		imageRes []types.ResultItem
		audioRes []types.ResultItem
		textRes  []types.TextResultItem
	)

	type child struct {
		future workflow.ChildWorkflowFuture
		ctx    workflow.Context
		cancel workflow.CancelFunc
		result *[]types.ResultItem
	}

	var children []*child
	addChild := func(files []types.FileTypeParams, queue, name string, res *[]types.ResultItem) {
		if len(files) == 0 {
			*res = []types.ResultItem{}
			return
		}
		ctx, cancel := createChildContext(ctx, queue)
		f := workflow.ExecuteChildWorkflow(ctx, name, params.RequestId, params.UserId, files)

		children = append(children, &child{f, ctx, cancel, res})
	}

	addChild(params.Files.Images, constants.ImageWorkflowQueueName, constants.ImageWorkflowName, &imageRes)
	addChild(audioInputFiles, constants.AudioWorkflowQueueName, constants.AudioWorkflowName, &audioRes)

	if len(children) > 0 {
		errCh := workflow.NewChannel(ctx)

		for _, c := range children {
			c := c // capture
			workflow.Go(ctx, func(gctx workflow.Context) {
				var local []types.ResultItem
				err := c.future.Get(gctx, &local)
				if err == nil {
					*c.result = local
				}
				errCh.Send(gctx, err)
			})
		}

		var firstErr error
		for range children {
			var err error
			errCh.Receive(ctx, &err)
			if err != nil && firstErr == nil {
				firstErr = err
			}
		}

		for _, c := range children {
			c.cancel()
		}

		if firstErr != nil {
			w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
			return nil, firstErr
		}
	}

	// === Подготовка текста ===
	var textReq []types.ResultItem
	for _, text := range params.Files.Texts {
		textReq = append(textReq, types.ResultItem{
			Id:               text.Id,
			OriginalFilename: text.OriginalFilename,
			Filename:         text.Filename,
			RecognizedText:   "",
		})
	}

	var combined []types.ResultItem
	if err := workflow.ExecuteActivity(ctx, w.Activity.CombineTexts, [][]types.ResultItem{imageRes, audioRes, textReq}).Get(ctx, &combined); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	if err := workflow.ExecuteActivity(ctx, w.Activity.SaveRawResults, params.RequestId, combined).Get(ctx, nil); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	var blacklist []string
	if err := workflow.ExecuteActivity(ctx, w.Activity.GetBlacklist, params.UserId).Get(ctx, &blacklist); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	var settings gomodels.Settings
	if err := workflow.ExecuteActivity(ctx, w.Activity.GetSettings, params.UserId).Get(ctx, &settings); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	textCtx, _ := createChildContext(ctx, constants.TextWorkflowQueueName)
	if err := workflow.ExecuteChildWorkflow(textCtx, constants.TextWorkflowName, params.RequestId, params.UserId, combined, blacklist, settings).Get(textCtx, &textRes); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	var finalResult types.WorkflowResult
	if err := workflow.ExecuteActivity(ctx, w.Activity.AssembleResult, params.RequestId, textRes).Get(ctx, &finalResult); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	if err := workflow.ExecuteActivity(ctx, w.Activity.SaveFormattedResults, params.RequestId, finalResult).Get(ctx, nil); err != nil {
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusFailed)
		return nil, err
	}

	if params.IsAsync {
		if err := workflow.ExecuteActivity(ctx, w.Activity.CallWebhook, params.UserId, finalResult).Get(ctx, nil); err != nil {
			return nil, err
		}
		stopCh.Send(ctx, true)
		w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusCompleted)

		return nil, nil
	}

	w.Request.UpdateStatus(context.Background(), params.RequestId, gomodels.NodeStatusCompleted)
	stopCh.Send(ctx, true)

	return &finalResult, nil
}

func createChildContext(parent workflow.Context, queueName string) (workflow.Context, workflow.CancelFunc) {
	childOpts := workflow.ChildWorkflowOptions{
		WorkflowExecutionTimeout: time.Hour,
		TaskQueue:                queueName,
	}
	ctx := workflow.WithChildOptions(parent, childOpts)
	return workflow.WithCancel(ctx)
}
