package grpcimpl

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
)

func (i *Impl) GetUserSettings(ctx context.Context, req *proto.GetUserSettingsRequest) (*proto.GetUserSettingsResponse, error) {
	userId := int(req.UserId)

	settings, err := i.SettingsService.GetByUserId(ctx, userId)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create webhook")
	}
	return &proto.GetUserSettingsResponse{
		UserId:                          req.UserId,
		ToxicityClassificationModelName: settings.ToxicityClassificationModelName,
	}, nil
}
