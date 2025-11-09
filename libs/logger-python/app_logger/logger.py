import logging
import sys
import inspect
from datetime import datetime

class CustomFormatter(logging.Formatter):
    def __init__(self, worker_name: str):
        super().__init__()
        self.worker_name = worker_name

    def format(self, record):
        # Получаем информацию о месте вызова
        frame = inspect.currentframe()
        while frame:
            info = inspect.getframeinfo(frame)
            if info.filename != __file__:
                break
            frame = frame.f_back

        filename = info.filename if frame else "unknown"
        lineno = info.lineno if frame else 0

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_type = record.levelname
        log_msg = record.getMessage()

        return f"{timestamp} {log_type} {log_msg} {self.worker_name} {{{filename}:{lineno}}}"

def setup_logger(worker_name: str) -> logging.Logger:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(CustomFormatter(worker_name))

    logger = logging.getLogger(f"logger_{worker_name}")
    logger.setLevel(logging.DEBUG)
    logger.handlers.clear()
    logger.addHandler(handler)
    logger.propagate = False

    return logger

default_logger = setup_logger("default")