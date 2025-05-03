-- +goose Up
-- +goose StatementBegin
ALTER TABLE task ADD COLUMN original_name TEXT NOT NULL;
ALTER TABLE task RENAME TO tasks;
ALTER TABLE task_group RENAME TO task_groups;
ALTER TABLE task_result RENAME TO task_results;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE tasks RENAME TO task;
ALTER TABLE task_groups RENAME TO task_group;
ALTER TABLE task_results RENAME TO task_result;
ALTER TABLE tasks DROP COLUMN original_name;
-- +goose StatementEnd
