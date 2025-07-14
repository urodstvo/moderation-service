package gomodels

type Blacklist struct {
	Id     int    `json:"id"`
	UserId int    `json:"user_id"`
	Phrase string `json:"phrase"`
}
