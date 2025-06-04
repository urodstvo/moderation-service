import os
from dataclasses import dataclass
from dotenv import load_dotenv


@dataclass
class Config:
    DatabaseUrl: str
    AppEnv: str = "development"
    CDNPublicUrl: str
    CDNHost: str
    CDNBucket: str
    CDNRegion: str = None
    CDNAccessToken: str
    CDNSecretToken: str
    NatsUrl: str = "localhost:4222"


def get_config() -> Config:
    AppEnv = os.getenv("APP_ENV", "development")

    if AppEnv == "development":
        load_dotenv(".env", override=True)

    config = Config(
        DatabaseUrl=os.getenv("DATABASE_URL"),
        AppEnv=AppEnv,
        CDNPublicUrl=os.getenv("S3_PUBLIC_URL"),
        CDNHost=os.getenv("S3_HOST"),
        CDNBucket=os.getenv("S3_BUCKET"),
        CDNRegion=os.getenv("S3_REGION"),
        CDNAccessToken=os.getenv("S3_ACCESS_TOKEN"),
        CDNSecretToken=os.getenv("S3_SECRET_TOKEN"),
        NatsUrl=os.getenv("NATS_URL", "localhost:4222"),
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