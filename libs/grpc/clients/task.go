package grpc_clients

import (
	"log"

	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"github.com/urodstvo/moderation-service/libs/grpc/task"
	"google.golang.org/grpc"
)

func NewGRPCTaskClient(env string) task.TaskServiceClient {
	serverAddress := createClientAddr(env, "task", constants.TASK_SERVER_PORT)

	conn, err := grpc.NewClient(serverAddress, defaultClientsOptions...)
	if err != nil {
		log.Fatalf("did not created conn: %v", err)
	}
	c := task.NewTaskServiceClient(conn)

	return c
}
