package nats

type TaskStatusUpdate struct {
	TaskId     int    `json:"task_id"`
	NodeKey    string `json:"node_key"`
	NodeStatus string `json:"node_status"`
	Message    any    `json:"message"`
}

type eventBus struct {
	TaskStatusUpdate Jetstream[TaskStatusUpdate]
}
