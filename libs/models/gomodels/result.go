package gomodels

import "database/sql"

type RequestResult struct {
	RequestId int            `json:"task_id"`
	Raw       string         `json:"raw"`
	Formatted sql.NullString `json:"formatted"`
}
