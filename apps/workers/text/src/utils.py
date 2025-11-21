from app_config import get_config
from app_logger import setup_logger
from minio_client import MinioClient

CONFIG = get_config()

logger = setup_logger("text_worker")

minio_client = MinioClient(CONFIG, logger)