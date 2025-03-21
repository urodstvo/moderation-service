package nats

type GetTaskResponse struct {
	TaskId string `json:"taskId"`
}

type SetTaskRequest struct {
	TaskId string `json:"taskId"`
}

type TaskDoneRequest struct {
	TaskId string `json:"taskId"`
}

type TaskDoneResponse struct {
	TaskId string `json:"taskId"`
}

type eventBus struct {
	GetTask Queue[struct{}, GetTaskResponse]
	SetTask Queue[SetTaskRequest, struct{}]

	TaskDone Queue[TaskDoneRequest, TaskDoneResponse]
}
