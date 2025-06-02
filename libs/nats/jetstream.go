package nats

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

type ConsumeSubscribeCallback[Req any] func(ctx context.Context, data Req)

type Jetstream[Req any] interface {
	Publish(data Req) error
	Consume(queueGroup string, data ConsumeSubscribeCallback[Req]) error
	Unsubscribe()
}

type JetstreamQueue[Req any] struct {
	nc           *nats.Conn
	js           jetstream.JetStream
	consumer     jetstream.Consumer
	subscription jetstream.ConsumeContext
	subject      string
	streamName   string
	timeout      time.Duration
}

func NewJetstreamQueue[Req any](
	nc *nats.Conn,
	subject string,
	streamName string,
	timeout time.Duration,
) *JetstreamQueue[Req] {
	ctx := context.Background()

	js, _ := jetstream.New(nc)

	_, err := js.Stream(ctx, streamName)
	if errors.Is(err, jetstream.ErrStreamNotFound) {
		js.CreateStream(ctx, jetstream.StreamConfig{
			Name:     streamName,
			Subjects: []string{subject},
		})
	}

	return &JetstreamQueue[Req]{
		nc:         nc,
		js:         js,
		subject:    subject,
		streamName: streamName,
		timeout:    timeout,
	}
}

func (c *JetstreamQueue[Req]) Consume(ctx context.Context, name string, cb ConsumeSubscribeCallback[Req]) error {
	cons, err := c.js.CreateOrUpdateConsumer(ctx, c.streamName, jetstream.ConsumerConfig{
		Name:          name,
		AckPolicy:     jetstream.AckExplicitPolicy,
		DeliverPolicy: jetstream.DeliverAllPolicy,
	})
	if err != nil {
		return err
	}

	consContext, err := cons.Consume(func(msg jetstream.Msg) {
		var req Req
		err := json.Unmarshal(msg.Data(), &req)
		if err != nil {
			_ = msg.Nak()
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), c.timeout)
		defer cancel()

		cb(ctx, req)

		_ = msg.Ack()
	})
	if err != nil {
		return err
	}

	c.subscription = consContext
	return nil
}

func (c *JetstreamQueue[Req]) Publish(ctx context.Context, data Req) error {
	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = c.js.Publish(ctx, c.subject, bytes)
	return err
}

func (c *JetstreamQueue[Req]) Unsubscribe() {
	if c.subscription != nil {
		c.subscription.Stop()
	}
}
