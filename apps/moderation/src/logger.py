import logging

# Настройка логгера
logger = logging.getLogger("app_logger")
logger.setLevel(logging.DEBUG)  # Можно поменять на INFO или WARNING в проде

# Формат логов
formatter = logging.Formatter(
    "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Консольный хендлер
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

# Добавляем хендлер к логгеру (если ещё не добавлен)
if not logger.hasHandlers():
    logger.addHandler(console_handler)
