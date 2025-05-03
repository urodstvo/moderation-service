package task

import (
	"context"
	"fmt"
)

func (r *repository) Create(ctx context.Context, groupId int, contentType string, filePath string, originalName string) (int, error) {
	conn := r.getter.DefaultTrOrDB(ctx, r.db)

	query, args, err := sq.Insert("tasks").Columns("group_id", "content_type", "file_path", "original_name").Values(groupId, contentType, filePath, originalName).Suffix("RETURNING id").ToSql()
	if err != nil {
		return 0, fmt.Errorf("failed to build query: %w", err)
	}

	var taskID int
	err = conn.QueryRow(ctx, query, args...).Scan(&taskID)
	if err != nil {
		return 0, fmt.Errorf("failed to execute query: %w", err)
	}

	return taskID, nil
}
