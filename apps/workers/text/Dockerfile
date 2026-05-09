FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Установка системных зависимостей и Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==$POETRY_VERSION"

# Копирование локальных библиотек (для path-зависимостей)
COPY libs ./libs

# Копирование файлов Poetry в правильную директорию
COPY apps/workers/text/poetry.lock \
     apps/workers/text/pyproject.toml \
     apps/workers/text/poetry.toml \
     /app/apps/workers/text/

# Установка зависимостей (в правильной директории)
RUN cd /app/apps/workers/text && \
    poetry install --no-interaction --no-ansi --no-root

# Копирование исходного кода
COPY apps/workers/text /app/apps/workers/text

# Рабочая директория
WORKDIR /app/apps/workers/text

# Создание пользователя
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

USER appuser

CMD ["python", "main.py"]
