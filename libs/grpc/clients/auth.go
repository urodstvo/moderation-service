package grpc_clients

import (
	"log"

	"github.com/urodstvo/moderation-service/libs/grpc/auth"
	"github.com/urodstvo/moderation-service/libs/grpc/constants"
	"google.golang.org/grpc"
)

func NewGRPCAuthClient(env string) auth.AuthServiceClient {
	serverAddress := createClientAddr(env, "auth", constants.AUTH_SERVER_PORT)

	conn, err := grpc.NewClient(serverAddress, defaultClientsOptions...)
	if err != nil {
		log.Fatalf("did not created conn: %v", err)
	}
	c := auth.NewAuthServiceClient(conn)

	return c
}
