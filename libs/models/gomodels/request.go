package gomodels

import (
	"database/sql"
	"time"
)

type Request struct {
	Id     int    `json:"id"`
	UserId int    `json:"user_id"`
	Status Status `json:"status"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`
}
