package gomodels

import "database/sql"

type TaskResult struct {
	TaskId    int            `json:"task_id"`
	Raw       string         `json:"raw"`
	Formatted sql.NullString `json:"formatted"`
}
