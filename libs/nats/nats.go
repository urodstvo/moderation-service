package nats

import (
	"time"

	"github.com/nats-io/nats.go"
	"github.com/urodstvo/moderation-service/libs/config"
)

type Bus struct {
	*eventBus
}

func NewNatsBus(nc *nats.Conn) *Bus {
	return &Bus{
		&eventBus{
			Task: NewNatsQueue[Task, struct{}](
				nc,
				TASK,
				30*time.Minute,
				nats.GOB_ENCODER,
			),

			TaskDone: NewNatsQueue[TaskDone, struct{}](
				nc,
				TASK_DONE,
				30*time.Minute,
				nats.GOB_ENCODER,
			),
		},
	}
}

func NewNatsBusFx(serviceName string) func(config config.Config) (*Bus, error) {
	return func(config config.Config) (*Bus, error) {
		nc, err := nats.Connect(config.NatsUrl, nats.Name(serviceName))
		if err != nil {
			return nil, err
		}

		return NewNatsBus(nc), nil
	}
}
