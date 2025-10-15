package grpc_clients

import (
	"log"

	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"google.golang.org/grpc"
)

func NewGRPCWebhookClient(env string) proto.WebhookServiceClient {
	serverAddress := createClientAddr(env, "webhook", constants.WEBHOOK_SERVER_PORT)

	conn, err := grpc.NewClient(serverAddress, defaultClientsOptions...)
	if err != nil {
		log.Fatalf("failed to create conn: %v", err)
	}
	c := proto.NewWebhookServiceClient(conn)

	return c
}
