-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

ALTER TABLE user_settings
    ADD COLUMN nsfw_classification_model_name VARCHAR(255) NOT NULL DEFAULT 'falconsai';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

ALTER TABLE user_settings
    DROP COLUMN IF EXISTS nsfw_classification_model_name;

-- +goose StatementEnd
