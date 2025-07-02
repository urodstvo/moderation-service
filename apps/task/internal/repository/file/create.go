package file

import (
	"context"
	"fmt"
)

func (r *repository) Create(ctx context.Context, requestId int, contentType string, filename string, originalFilename string) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("files").Columns("request_id", "content_type", "filename", "original_filename").
		Values(requestId, contentType, filename, originalFilename).Suffix("RETURNING id").ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var fileId int
	err = conn.QueryRow(ctx, query, args...).Scan(&fileId)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return fileId, nil
}
