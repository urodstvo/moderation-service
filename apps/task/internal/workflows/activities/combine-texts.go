package activities

import (
	"context"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
)

func (a *Activity) CombineTexts(ctx context.Context, input [][]types.ResultItem) ([]types.ResultItem, error) {
    var result []types.ResultItem
    for _, part := range input {
        result = append(result, part...)
    }
    return result, nil // ← всегда nil, если нет ошибок
}
