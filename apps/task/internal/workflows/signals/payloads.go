package signals

import "encoding/json"

// CreateNodeSignal is the typed representation of a create-node signal payload.
type CreateNodeSignal struct {
	UserID       int             `json:"user_id"`
	WorkflowID   int             `json:"workflow_id"`
	ParentNodeID *int            `json:"parent_node_id,omitempty"`
	Details      json.RawMessage `json:"details"`
}

// UpdateNodeSignal is the typed representation of an update-node signal payload.
type UpdateNodeSignal struct {
	NodeID  int             `json:"node_id"`
	Status  string          `json:"status"`
	Details json.RawMessage `json:"details"`
}
