import os
from subprocess import CalledProcessError
import time
import ffmpeg
import tempfile

from .audio import AudioProcessor 
from src.minio import minioClient
from src.logger import logger

class VideoProcessor(AudioProcessor):
    pass
    # def _load_audio_from_minio(self) -> bytes:
    #     try:
    #         ext = os.path.splitext(self.filename)[1]
    #         tmp_video = tempfile.NamedTemporaryFile(suffix=ext, delete=True)
    #         tmp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=True)

    #         # Повторные попытки загрузки файла из Minio
    #         if not self.download_file_with_retry(tmp_video.name):
    #             raise Exception(f"Не удалось скачать файл {self.filename} после нескольких попыток.")

    #         # Преобразуем видео в аудио с помощью ffmpeg
    #         try:
    #             ffmpeg.input(tmp_video.name).output(tmp_audio.name, acodec='pcm_s16le', ac=1, ar='16000').run(quiet=True, overwrite_output=True)
    #         except CalledProcessError as e:
    #             logger.error(f"Ошибка при выполнении ffmpeg: {e}")
    #             raise e

    #         with open(tmp_audio.name, "rb") as f:
    #             audio_bytes = f.read()

    #         # Удаляем временные файлы
    #         os.remove(tmp_video.name)
    #         os.remove(tmp_audio.name)

    #         return audio_bytes

    #     except Exception as e:
    #         logger.error(f"Ошибка при обработке видео {self.filename}: {e}")
    #         raise e

    # def download_file_with_retry(self, destination_path: str, retries: int = 5, delay: int = 2) -> bool:
    #     """
    #     Функция для загрузки файла с Minio с повторными попытками в случае ошибок (например, если файл заблокирован).
    #     """
    #     for attempt in range(retries):
    #         try:
    #             minioClient.download_file(self.filename, destination_path)
    #             return True  # Успешно скачали файл
    #         except Exception as e:
    #             if attempt < retries - 1:
    #                 logger.warning(f"Не удалось скачать файл {self.filename} (попытка {attempt + 1}/{retries}), ошибка: {e}. Повторная попытка через {delay} секунд.")
    #                 time.sleep(delay)
    #             else:
    #                 logger.error(f"Не удалось скачать файл {self.filename} после {retries} попыток.")
    #                 return False