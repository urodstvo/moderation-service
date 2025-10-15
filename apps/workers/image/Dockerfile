# Use official Python runtime as base image
FROM python:3.11-slim

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    PATH="/opt/poetry/bin:$PATH" \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies and Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    curl \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sSL https://install.python-poetry.org | python3 - --version 1.6.1 && \
    ln -s /root/.local/bin/poetry /opt/poetry/bin/poetry || true

# Copy Poetry files and install dependencies first for better caching
COPY pyproject.toml poetry.lock poetry.toml ./
RUN poetry install --no-interaction --no-ansi --no-root

# Copy application source
COPY . .

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

CMD ["poetry", "run", "python", "main.py"]