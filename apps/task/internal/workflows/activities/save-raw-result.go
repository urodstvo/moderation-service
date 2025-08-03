package activities

import (
	"context"
	"encoding/json"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
)

func (a *Activity) SaveRawResults(ctx context.Context, requestId int, result []types.ResultItem) error {
	res_bytes, err := json.Marshal(result)
	if err != nil {
		return err
	}

	err = a.ResultService.Create(ctx, requestId, string(res_bytes))
	if err != nil {
		return err
	}
	return nil
}
