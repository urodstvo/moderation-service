package grpcimpl

import "github.com/urodstvo/moderation-service/libs/grpc/task"

type Impl struct {
	task.UnimplementedTaskServiceServer
}
