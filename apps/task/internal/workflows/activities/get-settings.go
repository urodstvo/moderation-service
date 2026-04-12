package activities

import (
	"context"

	"github.com/urodstvo/moderation-service/libs/grpc/proto"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (a *Activity) GetSettings(ctx context.Context, userId int) (gomodels.Settings, error) {
	settings, err := a.AuthClient.GetUserSettings(ctx, &proto.GetUserSettingsRequest{UserId: int32(userId)})
	if err != nil {
		return gomodels.Settings{}, err
	}
	var userSettings gomodels.Settings
	userSettings.UserId = userId
	userSettings.ToxicityClassificationModelName = settings.ToxicityClassificationModelName
	userSettings.NsfwClassificationModelName = settings.NsfwClassificationModelName

	return userSettings, nil
}
