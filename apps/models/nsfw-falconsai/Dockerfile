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

COPY apps/models/nsfw-falconsai/pyproject.toml \
     /app/apps/models/nsfw-falconsai/

RUN cd /app/apps/models/nsfw-falconsai && \
    poetry install --no-interaction --no-ansi --no-root

COPY apps/models/nsfw-falconsai /app/apps/models/nsfw-falconsai

WORKDIR /app/apps/models/nsfw-falconsai

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
