package gomodels

import (
	"database/sql"
	"time"
)

type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`

	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at"`

	IsVerified bool   `json:"is_verified"`
	Role       string `json:"role"`
}
