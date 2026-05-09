FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Установка системных зависимостей для OpenCV, EasyOCR, Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    curl \
    ca-certificates \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libtiff5-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==$POETRY_VERSION"

# Копирование локальных библиотек (для path-зависимостей)
COPY libs ./libs

# Копирование файлов Poetry в правильную директорию
COPY apps/workers/image/poetry.lock \
     apps/workers/image/pyproject.toml \
     apps/workers/image/poetry.toml \
     /app/apps/workers/image/

# Установка зависимостей
RUN cd /app/apps/workers/image && \
    poetry install --no-interaction --no-ansi --no-root

# Копирование кода
COPY apps/workers/image ./apps/workers/image

WORKDIR /app/apps/workers/image

# Пользователь
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

CMD ["python", "main.py"]
