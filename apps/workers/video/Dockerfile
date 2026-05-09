FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Установка системных зависимостей + ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    ca-certificates \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==$POETRY_VERSION"

# Копирование локальных библиотек (для path-зависимостей)
COPY libs ./libs

# Копирование файлов Poetry в правильную директорию
COPY apps/workers/video/poetry.lock \
     apps/workers/video/pyproject.toml \
     apps/workers/video/poetry.toml \
     /app/apps/workers/video/

# Установка Python-зависимостей
RUN cd /app/apps/workers/video && \
    poetry install --no-interaction --no-ansi --no-root

# Копирование кода
COPY apps/workers/video ./apps/workers/video

WORKDIR /app/apps/workers/video

# Пользователь
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

CMD ["python", "main.py"]
