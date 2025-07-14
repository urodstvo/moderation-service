package activities

import "github.com/urodstvo/moderation-service/apps/task/internal/workflows/types"

type TextResultItem struct {
}

type ImageResultItem struct {
}

//TODO: Implement AssembleResult method
func (a *Activity) AssembleResult(text []TextResultItem, image []ImageResultItem) (types.WorkflowResult, error) {
	var result types.WorkflowResult
	return result, nil
}
