import os

# CDN
CDN_PUBLIC_URL = os.getenv("CDN_PUBLIC_URL")
CDN_HOST = os.getenv("CDN_HOST")
CDN_BUCKET = os.getenv("CDN_BUCKET")
CDN_REGION = os.getenv("CDN_REGION")
CDN_ACCESS_TOKEN = os.getenv("CDN_ACCESS_TOKEN")
CDN_SECRET_TOKEN = os.getenv("CDN_SECRET_TOKEN")

# Postgres
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_URL = os.getenv("POSTGRES_URL")


NATS_URL = os.getenv("NATS_URL", "nats://localhost:4222")
# NATS_URL = "nats://localhost:4222"