package gomodels

import (
	"database/sql"
	"time"
)

type NodeStatus string

const (
	NodeStatusCreated    NodeStatus = "created"
	NodeStatusProcessing NodeStatus = "processing"
	NodeStatusCompleted  NodeStatus = "completed"
	NodeStatusFailed     NodeStatus = "failed"
	NodeStatusAborted    NodeStatus = "aborted"
)

type NodeKeyName string

const (
	NodeKeyNameRoot NodeKeyName = "root"
	// TODO: add other node keys as needed
	NodeKeyNameSendingResult NodeKeyName = "SendingResult"
)

type TaskStatusNode struct {
	TaskId  int            `json:"task_id"`
	NodeKey NodeKeyName    `json:"node_key"`
	Status  NodeStatus     `json:"status"`
	Details sql.NullString `json:"details"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}

type TaskStatusNodeRelation struct {
	TaskId    int    `json:"task_id"`
	ParentKey string `json:"parent_key"`
	ChildKey  string `json:"child_key"`
}

type TaskStatusTree struct {
	Name    NodeKeyName `json:"name"`
	Details *string     `json:"details,omitempty"`
	Status  NodeStatus  `json:"status"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Children []TaskStatusTree `json:"children,omitempty"`
}
