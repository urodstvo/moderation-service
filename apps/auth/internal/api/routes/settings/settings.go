package settings

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/urodstvo/moderation-service/apps/auth/internal/service/settings"
	"github.com/urodstvo/moderation-service/libs/config"
	"github.com/urodstvo/moderation-service/libs/logger"
	"go.uber.org/fx"
)

type Settings struct {
	Config          config.Config
	Logger          logger.Logger
	SettingsService settings.SettingsService
}

type Opts struct {
	fx.In

	Config          config.Config
	Logger          logger.Logger
	Huma            huma.API
	SettingsService settings.SettingsService
}

type updateSettingsRequest struct {
	UserId    int    `header:"X-User-Id"`
	ModelName string `path:"modelName"`
}

func NewUserRoutes(opts Opts) Settings {
	u := Settings{
		Logger:          opts.Logger,
		SettingsService: opts.SettingsService,
		Config:          opts.Config,
	}

	huma.Register(
		opts.Huma,
		huma.Operation{
			OperationID: "updateSettings",
			Method:      http.MethodPatch,
			Path:        "/user/settings/{modelName}",
			Tags:        []string{"Settings"},
			Summary:     "Update Settings",
		},
		func(ctx context.Context, i *updateSettingsRequest) (*struct{}, error) {
			userId := i.UserId
			err := u.SettingsService.UpdateModel(ctx, userId, i.ModelName)
			if err != nil {
				return &struct{}{}, huma.Error500InternalServerError("")
			}

			return &struct{}{}, nil
		},
	)

	return u
}
