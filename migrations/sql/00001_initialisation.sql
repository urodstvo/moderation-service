-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

-- Типы
CREATE TYPE node_status AS ENUM ('aborted', 'created', 'processing', 'completed', 'failed');
CREATE TYPE content_type AS ENUM ('text', 'image', 'audio', 'video');

-- Основные сущности
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(63) DEFAULT 'USER' NOT NULL
);

CREATE TABLE tokens (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE webhooks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status node_status NOT NULL DEFAULT 'created',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    filename VARCHAR(511),
    original_filename VARCHAR(511),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE status_nodes (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status node_status NOT NULL DEFAULT 'created',
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE status_node_relations (
    request_id INTEGER NOT NULL,
    parent_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    PRIMARY KEY (request_id, parent_id, child_id),
    FOREIGN KEY (parent_id) REFERENCES status_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES status_nodes(id) ON DELETE CASCADE
);

CREATE TABLE results (
    request_id INTEGER PRIMARY KEY REFERENCES requests(id) ON DELETE CASCADE,
    raw JSONB NOT NULL,
    formatted JSONB
);

CREATE TABLE blacklists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phrase VARCHAR(255) UNIQUE NOT NULL
);

-- Индексы
CREATE INDEX idx_files_request_id ON files(request_id);
CREATE INDEX idx_status_nodes_request_id ON status_nodes(request_id);
CREATE INDEX idx_status_node_relations_parent ON status_node_relations(parent_id);
CREATE INDEX idx_status_node_relations_child ON status_node_relations(child_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS status_node_relations;
DROP TABLE IF EXISTS status_nodes;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS blacklists;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS content_type;
DROP TYPE IF EXISTS node_status;

-- +goose StatementEnd