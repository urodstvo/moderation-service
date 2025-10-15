package grpc_clients

import (
	"log"

	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"google.golang.org/grpc"
)

func NewGRPCAuthClient(env string) proto.AuthServiceClient {
	serverAddress := createClientAddr(env, "auth", constants.AUTH_SERVER_PORT)

	conn, err := grpc.NewClient(serverAddress, defaultClientsOptions...)
	if err != nil {
		log.Fatalf("failed to create conn: %v", err)
	}
	c := proto.NewAuthServiceClient(conn)

	return c
}
