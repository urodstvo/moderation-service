up:
	docker-compose -f docker-compose.yaml up -d

down:
	docker-compose -f docker-compose.yaml down && docker network prune --force

migrate-update:
	alembic upgrade heads

run:
	docker-compose -f docker-compose.yaml up -d && cd ./frontend && pnpm install && pnpm run dev && cd .. && python -m venv venv && venv/scripts/activate.bat && cd ./backend && pip install -r requirements.txt && uvicorn "server:app" && alembic upgrade heads