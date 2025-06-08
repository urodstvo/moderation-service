package grpc_clients

import (
	"log"

	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"github.com/urodstvo/moderation-service/libs/grpc/webhook"
	"google.golang.org/grpc"
)

func NewGRPCWebhookClient(env string) webhook.WebhookServiceClient {
	serverAddress := createClientAddr(env, "webhook", constants.WEBHOOK_SERVER_PORT)

	conn, err := grpc.NewClient(serverAddress, defaultClientsOptions...)
	if err != nil {
		log.Fatalf("did not created conn: %v", err)
	}
	c := webhook.NewWebhookServiceClient(conn)

	return c
}
