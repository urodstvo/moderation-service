from app_config import get_config
from app_logger import setup_logger

CONFIG = get_config()

logger = setup_logger("video_worker")
