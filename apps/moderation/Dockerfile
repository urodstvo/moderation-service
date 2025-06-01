FROM python:3.11-slim AS builder

# System deps for builds
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      git \
      ffmpeg \
      libsndfile1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN python3 -m pip install --no-cache-dir poetry==2.1.2

WORKDIR /app
COPY pyproject.toml poetry.lock ./

# Use in-project venv
RUN poetry config virtualenvs.in-project true

ENV POETRY_HTTP_TIMEOUT=120

# Install only main dependencies (no dev, no root)
RUN poetry install --no-root --only main

# Copy app code
COPY . .

# Final minimal runtime image
FROM python:3.11-slim

# Runtime deps only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ffmpeg \
      libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only built venv and app code
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app /app

# Use venv's Python directly
CMD ["/app/.venv/bin/python", "-m", "server"]
