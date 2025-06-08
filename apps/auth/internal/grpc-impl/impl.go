package grpcimpl

import "github.com/urodstvo/moderation-service/libs/grpc/auth"

type Impl struct {
	auth.UnimplementedAuthServiceServer
}
