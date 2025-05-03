package gomodels

import (
	"database/sql"
	"time"
)

type Task struct {
	Id          int    `json:"id"`
	GroupId     int    `json:"group_id"`
	Status      string `json:"status"`
	ContentType string `json:"content_type"`
	FilePath    string `json:"file_path"`
	OriginalName string `json:"original_name"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}
