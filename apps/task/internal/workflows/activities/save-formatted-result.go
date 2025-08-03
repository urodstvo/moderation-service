package activities

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
)

func (a *Activity) SaveFormattedResults(ctx context.Context, requestId int, result types.WorkflowResult) error {
	resultStr, err := json.Marshal(result)
	if err != nil {
		return fmt.Errorf("marshal workflow result: %w", err)
	}

	if err := a.ResultService.UpdateFormatted(ctx, requestId, string(resultStr)); err != nil {
		return fmt.Errorf("update formatted result: %w", err)
	}

	return nil
}
