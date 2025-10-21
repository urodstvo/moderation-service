package activities

import (
	"context"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/signals"
)

func (a *Activity) UpdateNodeStatus(ctx context.Context, payload map[string]any) error {
	sig, err := signals.DecodeUpdateNode(payload)
	if err != nil {
		return err
	}

	status := signals.MapStatus(sig.Status)

	return a.StatusService.UpdateStatus(ctx, sig.NodeID, status)
}
