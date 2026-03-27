import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv


@dataclass
class Config:
    DatabaseUrl: str
    S3PublicUrl: str
    S3Host: str
    S3Bucket: str
    S3AccessToken: str
    S3SecretToken: str
    AppEnv: str = "development"
    S3Region: str = None
    NatsUrl: str = "localhost:4222"
    TemporalClientUrl: str = "localhost:7233"
    DetoxifyUrl: str = "localhost:4001"
    RubertUrl: str = "localhost:4002"
    ClassifierUrl: str = "localhost:4003"

def _find_env_file(start_dir: Path) -> Optional[Path]:
    """Ищет .env, начиная с текущей папки и поднимаясь до корня."""
    current = start_dir.resolve()
    while True:
        env_path = current / ".env"
        if env_path.is_file():
            return env_path

        # Поднимаемся на уровень выше
        parent = current.parent
        if parent == current:  # Достигли корня (/, C:\, etc.)
            break
        current = parent

    return None

def get_config() -> Config:
    AppEnv = os.getenv("APP_ENV", "development")

    # --- Поиск .env ---
    if AppEnv == "development":
        start_dir = Path.cwd()  # Текущая рабочая директория
        env_path = _find_env_file(start_dir)

        if env_path:
            print(f"Loading .env from: {env_path}")
            load_dotenv(env_path, override=True)
        else:
            print("No .env file found in any parent directory")

    # --- Чтение переменных ---
    config = Config(
        DatabaseUrl=os.getenv("DATABASE_URL"),
        AppEnv=AppEnv,
        S3PublicUrl=os.getenv("S3_PUBLIC_URL"),
        S3Host=os.getenv("S3_HOST"),
        S3Bucket=os.getenv("S3_BUCKET"),
        S3Region=os.getenv("S3_REGION"),
        S3AccessToken=os.getenv("S3_ACCESS_TOKEN"),
        S3SecretToken=os.getenv("S3_SECRET_TOKEN"),
        NatsUrl=os.getenv("NATS_URL", "localhost:4222"),
        TemporalClientUrl=os.getenv("TEMPORAL_CLIENT_URL", "localhost:7233"),
        DetoxifyUrl=os.getenv("DETOXIFY_URL", "http://localhost:4001"),
        RubertUrl=os.getenv("RUBERT_URL", "http://localhost:4002"),
        ClassifierUrl=os.getenv("CLASSIFIER_URL", "http://localhost:4003"),
    )

    validate_config(config)
    return config

def validate_config(config: Config) -> None:
    if not config.DatabaseUrl:
        raise ValueError("DATABASE_URL is required")
    if not config.S3PublicUrl:
        raise ValueError("S3_PUBLIC_URL is required")
    if not config.S3Host:
        raise ValueError("S3_HOST is required")
    if not config.S3Bucket:
        raise ValueError("S3_BUCKET is required")
    if not config.S3AccessToken:
        raise ValueError("S3_ACCESS_TOKEN is required")
    if not config.S3SecretToken:
        raise ValueError("S3_SECRET_TOKEN is required")
    if not config.TemporalClientUrl:
        raise ValueError("TEMPORAL_CLIENT_URL is required")