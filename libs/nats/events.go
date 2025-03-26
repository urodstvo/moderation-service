package nats

type Task struct {
	TaskId int `json:"taskId"`
}

type TaskDone struct {
	TaskId int `json:"taskId"`
}

type eventBus struct {
	Task     Queue[Task, struct{}]
	TaskDone Queue[TaskDone, struct{}]
}
