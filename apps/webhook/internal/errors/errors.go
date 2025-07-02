package internal_errors

import "errors"

var (
	ErrNoRowsAffected = errors.New("no rows affected")
)
