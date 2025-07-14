package activities

import (
	"context"
)

func (a *Activity) GetBlacklist(userId int) ([]string, error) {
	blacklist, err := a.BlacklistService.GetOnlyPhrassesByUserId(context.Background(), userId)
	if err != nil {
		return nil, err
	}
	return blacklist, nil
}
