package settings

import (
	"context"
	"fmt"
)

func (r *repository) UpdateModels(ctx context.Context, userId int, toxicityModel string, nsfwModel string) error {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Update("user_settings").
		Set("toxicity_classification_model_name", toxicityModel).
		Set("nsfw_classification_model_name", nsfwModel).
		Where("user_id", userId).
		ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	cmdTag, err := conn.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows inserted")
	}

	return nil
}
