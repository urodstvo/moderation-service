package gomodels

import (
	"database/sql"
	"time"
)

type Status string

const (
	NodeStatusCreated    Status = "created"
	NodeStatusProcessing Status = "processing"
	NodeStatusCompleted  Status = "completed"
	NodeStatusFailed     Status = "failed"
	NodeStatusAborted    Status = "aborted"
)

type StatusNode struct {
	Id        int    `json:"id"`
	RequestId int    `json:"request_id"`
	Title     string `json:"title"`
	Details   string `json:"details"`
	Status    Status `json:"status"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}

type StatusNodeRelation struct {
	RequestId int `json:"request_id"`
	ParentId  int `json:"parent_id"`
	ChildId   int `json:"child_id"`
}

type StatusTree struct {
	*StatusNode

	Children []*StatusTree `json:"children,omitempty"`
}
