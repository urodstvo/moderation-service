package activities

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/urodstvo/moderation-service/apps/task/internal/service/blacklist"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/request"
	"github.com/urodstvo/moderation-service/apps/task/internal/service/result"
	statussvc "github.com/urodstvo/moderation-service/apps/task/internal/service/status"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"github.com/urodstvo/moderation-service/libs/logger"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
	"go.uber.org/fx"
)

type Opts struct {
	fx.In

	Logger logger.Logger

	WebhookClient proto.WebhookServiceClient
	AuthClient    proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	ResultService    result.ResultService
	RequestService   request.RequestService
	StatusService    statussvc.StatusTreeService
}

type Activity struct {
	Logger logger.Logger

	WebhookClient proto.WebhookServiceClient
	AuthClient    proto.AuthServiceClient

	BlacklistService blacklist.BlacklistService
	RequestService   request.RequestService
	ResultService    result.ResultService
	StatusService statussvc.StatusTreeService
}

func New(opts Opts) *Activity {
	return &Activity{
		Logger:           opts.Logger,
		WebhookClient:    opts.WebhookClient,
		AuthClient:       opts.AuthClient,
		BlacklistService: opts.BlacklistService,
		ResultService:    opts.ResultService,
		RequestService:   opts.RequestService,
		StatusService:    opts.StatusService,
	}
}

// PersistCreateNode persists a create-node signal payload from a child workflow.
func (a *Activity) PersistCreateNode(ctx context.Context, payload map[string]interface{}) error {
	// expected payload keys: user_id, workflow_id, parent_node_id, details
	var requestId int
	switch v := payload["workflow_id"].(type) {
	case float64:
		requestId = int(v)
	case int:
		requestId = v
	case string:
		// fallback if stringified
		fmt.Sscanf(v, "%d", &requestId)
	default:
		requestId = 0
	}

	// parent_node_id may be a string or number; convert to string for title
	var title string
	switch v := payload["parent_node_id"].(type) {
	case string:
		title = v
	case float64:
		title = fmt.Sprintf("%d", int(v))
	case int:
		title = fmt.Sprintf("%d", v)
	default:
		title = fmt.Sprintf("%v", v)
	}

	detailsBytes, _ := json.Marshal(payload["details"])
	detailsStr := string(detailsBytes)

	// create node and obtain its id
	childId, err := a.StatusService.CreateNode(ctx, requestId, title, &detailsStr)
	if err != nil {
		return err
	}

	// if payload provided numeric parent_node_id, create relation
	if parentVal, ok := payload["parent_node_id"]; ok {
		switch v := parentVal.(type) {
		case float64:
			parentId := int(v)
			_ = a.StatusService.CreateRelation(ctx, requestId, parentId, childId)
		case int:
			parentId := v
			_ = a.StatusService.CreateRelation(ctx, requestId, parentId, childId)
		case string:
			// attempt to parse numeric parent id from string
			var pid int
			if _, err := fmt.Sscanf(v, "%d", &pid); err == nil {
				_ = a.StatusService.CreateRelation(ctx, requestId, pid, childId)
			}
		default:
			// non-numeric parent id (e.g. title) — nothing to do for relations
		}
	}

	return nil
}

// PersistUpdateNodeStatus persists an update-node signal payload from a child workflow.
func (a *Activity) PersistUpdateNodeStatus(ctx context.Context, payload map[string]interface{}) error {
	// expected payload keys: node_id (request id), status, details
	var requestId int
	switch v := payload["node_id"].(type) {
	case float64:
		requestId = int(v)
	case int:
		requestId = v
	case string:
		fmt.Sscanf(v, "%d", &requestId)
	default:
		requestId = 0
	}

	statusStr, _ := payload["status"].(string)

	var status gomodels.Status
	switch statusStr {
	case "created":
		status = gomodels.NodeStatusCreated
	case "processing":
		status = gomodels.NodeStatusProcessing
	case "completed":
		status = gomodels.NodeStatusCompleted
	case "failed":
		status = gomodels.NodeStatusFailed
	case "aborted":
		status = gomodels.NodeStatusAborted
	default:
		status = gomodels.NodeStatusProcessing
	}

	return a.StatusService.UpdateStatus(ctx, requestId, status)
}
