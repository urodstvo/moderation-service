package activities

import (
	"context"
	"fmt"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/signals"
)

func (a *Activity) CreateNode(ctx context.Context, payload map[string]any) error {
	sig, err := signals.DecodeCreateNode(payload)
	if err != nil {
		return err
	}

	var title string
	if sig.ParentNodeID != nil {
		title = fmt.Sprintf("%d", *sig.ParentNodeID)
	} else {
		title = ""
	}

	detailsStr := string(sig.Details)

	childId, err := a.StatusService.CreateNode(ctx, sig.WorkflowID, title, &detailsStr)
	if err != nil {
		return err
	}

	if sig.ParentNodeID != nil {
		_ = a.StatusService.CreateRelation(ctx, sig.WorkflowID, *sig.ParentNodeID, childId)
	}

	return nil
}
