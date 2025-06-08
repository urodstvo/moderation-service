package blacklist

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/moderation-service/libs/models/gomodels"
)

func (r *repository) GetByUserId(ctx context.Context, userId int) ([]gomodels.Blacklist, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Select("*").From("blacklists").Where(squirrel.Eq{"user_id": userId}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := conn.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	var t []gomodels.Blacklist
	for rows.Next() {
		blacklist := gomodels.Blacklist{}
		err = rows.Scan(&blacklist.UserId, &blacklist.Phrase)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		t = append(t, blacklist)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error while iterating over rows: %w", err)
	}

	return t, nil
}
