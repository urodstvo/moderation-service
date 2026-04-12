package grpcimpl

import (
	"context"
	"log/slog"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/libs/grpc/proto"
)

func (i *Impl) GetUserSettings(ctx context.Context, req *proto.GetUserSettingsRequest) (*proto.GetUserSettingsResponse, error) {
	userId := int(req.UserId)

	settings, err := i.SettingsService.GetByUserId(ctx, userId)
	if err != nil {
		i.Logger.Error("Failed to get user settings", slog.Any("error", err), slog.Any("userId", userId))
		return nil, huma.Error500InternalServerError("Failed to get settings")
	}
	return &proto.GetUserSettingsResponse{
		UserId:                          req.UserId,
		ToxicityClassificationModelName: settings.ToxicityClassificationModelName,
		NsfwClassificationModelName:     settings.NsfwClassificationModelName,
	}, nil
}
