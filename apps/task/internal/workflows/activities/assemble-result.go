package activities

import (
	"context"

	"github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"
)

func (a *Activity) AssembleResult(ctx context.Context, requestId int, text []types.TextResultItem) (types.WorkflowResult, error) {
	request, err := a.RequestService.GetById(ctx, requestId)
	if err != nil {
		return types.WorkflowResult{}, err
	}
	var result types.WorkflowResult
	result.RequestId = requestId
	result.CreatedAt = request.CreatedAt
	result.UpdatedAt = request.UpdatedAt
	result.Status = "completed"
	result.TotalFiles = len(text)
	for _, t := range text {
		result.Files = append(result.Files, types.WorkflowResultFile{
			FileId:         t.Id,
			Filename:       t.OriginalFilename,
			ContentType:    t.ContentType,
			RecognizedText: &t.RecognizedText,
			Classification: t.Classification,
			Words:          t.Words,
		})
	}

	return result, nil
}
