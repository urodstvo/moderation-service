-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE user_settings (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    toxicity_classification_model_name VARCHAR(255) NOT NULL DEFAULT 'detoxify'
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

DROP TABLE IF EXISTS user_settings;

-- +goose StatementEnd