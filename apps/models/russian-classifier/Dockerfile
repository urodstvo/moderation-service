FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==$POETRY_VERSION"

COPY apps/models/russian-classifier/poetry.lock \
     apps/models/russian-classifier/pyproject.toml \
     apps/models/russian-classifier/poetry.toml \
     /app/apps/models/russian-classifier/

RUN cd /app/apps/models/russian-classifier && \
    poetry install --no-interaction --no-ansi --no-root

COPY apps/models/russian-classifier /app/apps/models/russian-classifier

WORKDIR /app/apps/models/russian-classifier

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
