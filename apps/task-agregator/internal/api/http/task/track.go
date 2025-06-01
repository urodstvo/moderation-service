package task_routes

import "context"

type TrackEvent struct {
	TaskGroupID int    `json:"task_group_id"`
	TaskID      int    `json:"task_id"`
	Status      string `json:"status"`
}

func (h *handler) Track(ctx context.Context) {
	// get id from url
	// check access permission for user
	// do other...
}
