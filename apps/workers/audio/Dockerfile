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
    curl \
    ca-certificates \
    ffmpeg \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==$POETRY_VERSION" \
    && poetry --version

# Копирование локальных библиотек (для path-зависимостей)
COPY libs ./libs

# Копирование файлов Poetry в правильную директорию
COPY apps/workers/audio/poetry.lock \
     apps/workers/audio/pyproject.toml \
     apps/workers/audio/poetry.toml \
     /app/apps/workers/audio/

# Установка зависимостей (в правильной директории)
RUN cd /app/apps/workers/audio && \
    poetry install --no-interaction --no-ansi --no-root

# Копируем код ПОСЛЕ установки зависимостей
COPY apps/workers/audio ./apps/workers/audio

WORKDIR /app/apps/workers/audio

# Создаём пользователя
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

USER appuser

CMD ["python", "main.py"]
