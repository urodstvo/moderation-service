package gomodels

import (
	"database/sql"
	"time"
)

type TaskStatus string

const (
	TaskStatusCreated    TaskStatus = "created"
	TaskStatusProcessing TaskStatus = "processing"
	TaskStatusFormatting TaskStatus = "formatting"
	TaskStatusSending    TaskStatus = "sending"
	TaskStatusCompleted  TaskStatus = "completed"
	TaskStatusFailed     TaskStatus = "failed"
	TaskStatusAborted    TaskStatus = "aborted"
)

type TaskGroup struct {
	Id     int        `json:"id"`
	UserId int        `json:"user_id"`
	Status TaskStatus `json:"status"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}
