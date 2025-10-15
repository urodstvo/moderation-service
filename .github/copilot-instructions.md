## Quick orientation for AI assistants

This repository is a multi-service moderation platform (Go services + Python workers + frontend). Use this file as the canonical, concise reference for patterns, build/run flows, and where to find examples.

- Architecture (big picture)

  - Services (Go): `apps/auth`, `apps/task`, `apps/webhook` — each uses an internal/ package layout (api, repository, service, grpc-impl).
  - Workers (Python): `apps/workers/{text,image,video,audio}` — entrypoint: `main.py`, managed with Poetry (`pyproject.toml`, `poetry.toml`).
  - Shared libraries: `libs/`, `grpc/`, `models/`, `logger/`, `nats/`, `minio/`, `jwt/` contain reusable components used by services.
  - Infrastructure: `docker-compose.yaml` boots Postgres, MinIO, NATS (+JetStream), Temporal, Prometheus, Grafana. Many service blocks are commented out — infra-first; services are built from `apps/*/Dockerfile` when enabled.

- Integration points and protocols

  - Postgres: persistent storage (see `docker-compose.yaml`); migrations live in `migrations/` and `libs/migrations`.
  - MinIO: object storage (`libs/minio`, and `minio/` lib).
  - NATS (JetStream): event bus and streaming (see `libs/nats`, apps publish/subscribe via `nats` lib and `names.go`).
  - gRPC: inter-service RPCs. Proto files are in `grpc/proto/`. Code generation is expected (see `codegen/grpc.go`) — `protoc` and `protoc-gen-go-grpc` are required (also noted in README).
  - Temporal: workflows and orchestration (configs in `configs/temporal` and `docker-compose.yaml` uses `temporalio/auto-setup`).

- Developer workflows (concrete commands & order)

  - Local infra: populate `local.env` (or `.env`) then run the infra stack:
    - Use Docker Compose to run infrastructure: docker-compose up -d (powershell/cmd: `docker-compose up -d`).
    - Start Temporal after Postgres is healthy; `docker-compose.yaml` includes temporal service which depends on postgres.
  - Building Go services:
    - Each service is a Go module under `apps/<service>/` with `cmd/main.go`. Build in that folder: `go build ./...` or `go build ./cmd`.
    - The repo uses `go.work` and multiple modules — prefer working inside the module directory or use `go work sync` when adding modules.
  - Python workers:
    - Use Poetry in each worker folder: `poetry install` then run `python main.py` (or the Dockerfile provided for container runs).

- Project-specific conventions & patterns

  - Package layout (Go services): internal/{api,repository,service,grpc-impl} — follow these roles when adding code.
  - Shared libs under `libs/` and top-level packages (`logger`, `jwt`, `nats`) — prefer these over adding new global utilities.
  - gRPC implementations live under `grpc-impl` with thin server bootstrap in `cmd/main.go`.
  - Event names and subjects are centralized in `nats/names.go` — update there when adding events to keep global consistency.
  - Permissions/ACL: see `configs/permissions.yaml` and `codegen/permissions.go` for generation patterns.

- Codegen & Protobuf notes

  - Proto sources: `grpc/proto/`.
  - Codegen helper scripts in `codegen/` and CLI utilities in `cli/` (see `cli.go`, `prepare.go`). If you need to regenerate stubs, run protoc with `protoc-gen-go` and `protoc-gen-go-grpc` from the repo root so imports match module paths.

- Where to look for examples

  - Service entrypoints: `apps/auth/cmd/main.go`, `apps/task/cmd/main.go`, `apps/webhook/cmd/main.go`.
  - Worker entrypoint: `apps/workers/text/main.py` (and sibling dirs `image`, `video`, `audio`).
  - Shared event patterns: `libs/nats/jetstream.go`, `nats/names.go`.
  - DI and app wiring: `fx/` and `logger/fx.go` show how the project wires dependencies.

- Testing and linting

  - There are existing Go tests (e.g., `nats/jetstream_test.go`). Use `go test ./...` inside modules.
  - Frontend is a Vite app in `frontend/` — run with `pnpm install` / `npm install` then `pnpm dev` / `npm run dev` (see `frontend/package.json`).

- Safety & assumptions for AI edits
  - Don't modify infra credentials or secret files; prefer `local.env` for local runs.
  - When adding a new service, mirror the internal/ structure and add a Dockerfile and a `cmd/main.go` entrypoint.
  - Keep NATS subject names centralized in `nats/names.go` to avoid fragmentation.

If any section is unclear or you'd like examples expanded (e.g., exact protoc commands used here or a sample Dockerfile build for a Go service), tell me which part and I'll iterate.
