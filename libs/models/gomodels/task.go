package gomodels

import (
	"database/sql"
	"time"
)

type ContentType string

const (
	ContentTypeText  ContentType = "text"
	ContentTypeImage ContentType = "image"
	ContentTypeAudio ContentType = "audio"
	ContentTypeVideo ContentType = "video"
)

type Task struct {
	Id      int `json:"id"`
	GroupId int `json:"group_id"`

	ContentType      string `json:"content_type"`
	Filename         string `json:"filename"`
	OriginalFilename string `json:"original_filename"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}
