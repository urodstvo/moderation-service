package signals

import "github.com/urodstvo/moderation-service/libs/models/gomodels"

// MapStatus maps a string status to gomodels.Status with a sensible default.
func MapStatus(s string) gomodels.Status {
	switch s {
	case "created":
		return gomodels.NodeStatusCreated
	case "processing":
		return gomodels.NodeStatusProcessing
	case "completed":
		return gomodels.NodeStatusCompleted
	case "failed":
		return gomodels.NodeStatusFailed
	case "aborted":
		return gomodels.NodeStatusAborted
	default:
		return gomodels.NodeStatusProcessing
	}
}
