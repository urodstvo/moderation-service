package nats

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/nats-io/nats-server/v2/test"
	"github.com/nats-io/nats.go"
	"github.com/stretchr/testify/require"
)

func runTestServer() *nats.Conn {
	opts := test.DefaultTestOptions
	opts.Port = -1
	opts.JetStream = true
	s := test.RunServer(&opts)
	nc, err := nats.Connect(s.ClientURL())
	if err != nil {
		panic(err)
	}
	return nc
}

func TestPublishSubscribe(t *testing.T) {
	nc := runTestServer()
	defer nc.Close()

	ctx := context.Background()
	subject := "foo.subject"
	streamName := "foo-stream"

	queue := NewJetstreamQueue[string](nc, subject, streamName, time.Second*2)

	var received string
	var wg sync.WaitGroup
	wg.Add(1)

	err := queue.Consume(ctx, "durable-name", func(ctx context.Context, data string) {
		received = data
		wg.Done()
	})
	require.NoError(t, err)

	err = queue.Publish(ctx, "hello")
	require.NoError(t, err)

	wg.Wait()

	require.Equal(t, "hello", received)
}

func TestUnsubscribe(t *testing.T) {
	type Req struct{ Val string }

	nc := runTestServer()
	defer func() {
		if nc.IsConnected() {
			nc.Close()
		}
	}()

	queue := NewJetstreamQueue[Req](nc, "test.subject", "test-stream", time.Second)

	err := queue.Consume(context.Background(), "CONS", func(ctx context.Context, req Req) {
		t.FailNow() // не должен быть вызван
	})
	require.NoError(t, err)

	queue.Unsubscribe()

	err = queue.Publish(context.Background(), Req{Val: "should not be handled"})
	require.NoError(t, err)
}
