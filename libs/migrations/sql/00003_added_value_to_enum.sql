-- +goose Up
-- +goose StatementBegin
ALTER TYPE "task_status" ADD VALUE 'error';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Переименовать старый тип
ALTER TYPE "task_status" RENAME TO "task_status_old";

-- Создать новый ENUM без 'error'
CREATE TYPE "task_status" AS ENUM ('created', 'processed', 'completed');

-- Перевести все колонки на новый ENUM
ALTER TABLE your_table_name
    ALTER COLUMN your_column_name
    TYPE "task_status"
    USING your_column_name::text::"task_status";

-- Удалить старый тип
DROP TYPE "task_status_old";
-- +goose StatementEnd
