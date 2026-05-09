package activities

import (
	"context"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
)

func (a *Activity) CombineTexts(ctx context.Context, input [][]types.ResultItem) ([]types.ResultItem, error) {
    result := []types.ResultItem{}
    for _, part := range input {
        if part != nil {
            result = append(result, part...)
        }
    }
    return result, nil
}
