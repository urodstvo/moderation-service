package activities

import (
	"context"
)

func (a *Activity) GetBlacklist(ctx context.Context, userId int) ([]string, error) {
	blacklist, err := a.BlacklistService.GetOnlyPhrassesByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	return blacklist, nil
}
