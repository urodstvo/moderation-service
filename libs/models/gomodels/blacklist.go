package gomodels

type Blacklist struct {
	UserId int    `json:"user_id"`
	Phrase string `json:"phrase"`
}
