package nats

//TODO
type eventBus struct {
	GetTask Queue[struct{}, struct{}]
	SetTask Queue[struct{}, struct{}]

	TaskDone Queue[struct{}, struct{}]
}
