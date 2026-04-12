package settings

import (
	"context"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) (gomodels.Settings, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.
		Select("user_id", "toxicity_classification_model_name", "nsfw_classification_model_name").
		From("user_settings").
		Where(squirrel.Eq{"user_id": userId}).
		ToSql()
	if err != nil {
		return gomodels.Settings{}, fmt.Errorf("failed to build query: %w", err)
	}

	settings := gomodels.Settings{}
	err = conn.QueryRow(ctx, query, args...).Scan(
		&settings.UserId,
		&settings.ToxicityClassificationModelName,
		&settings.NsfwClassificationModelName,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return gomodels.Settings{}, fmt.Errorf("settings not found")
		}
		return gomodels.Settings{}, fmt.Errorf("failed to execute query: %w", err)
	}

	return settings, nil
}
