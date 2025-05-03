import mimetypes
from minio import Minio
from minio.error import S3Error
import numpy as np
from PIL import Image
import io
import soundfile as sf

from src.logger import logger
from src.config import CDN_ACCESS_TOKEN, CDN_BUCKET, CDN_HOST, CDN_PUBLIC_URL, CDN_REGION, CDN_SECRET_TOKEN


class MinioClient:
    def __init__(self):
        try:
            self.client = Minio(
                CDN_HOST,
                access_key=CDN_ACCESS_TOKEN,
                secret_key=CDN_SECRET_TOKEN,
                secure=False,
                region=CDN_REGION
            )
            logger.info("Подключение к MinIO установлено")
        except Exception as e:
            logger.error(f"Ошибка при подключении к MinIO: {e}")
            raise e

    def get_file(self, object_name: str) -> np.ndarray:
        """Скачивает файл из MinIO и возвращает его содержимое как np.ndarray"""
        try:
            response = self.client.get_object(CDN_BUCKET, object_name)
            data = response.read()
            content_type, _ = mimetypes.guess_type(object_name)

            if content_type and content_type.startswith("image/"):
                image = Image.open(io.BytesIO(data)).convert("RGB")
                return np.array(image)

            elif content_type and content_type.startswith("audio/"):
                audio_data, _ = sf.read(io.BytesIO(data))
                return audio_data

            elif content_type and content_type == "application/octet-stream":
                return np.load(io.BytesIO(data))

            else:
                raise ValueError(f"Неизвестный формат файла: {object_name}")

        except Exception as e:
            logger.error(f"Ошибка при загрузке и преобразовании файла {object_name}: {e}")
            raise e

    def upload_file(self, file_path: str, object_name: str):
        """Загружает файл в MinIO"""
        try:
            # Загружаем файл в указанный бакет
            self.client.fput_object(CDN_BUCKET, object_name, file_path)
            logger.info(f"Файл {file_path} успешно загружен как {object_name}")
        except S3Error as e:
            logger.error(f"Ошибка при загрузке файла в MinIO: {e}")

    def download_file(self, object_name: str, download_path: str):
        """Скачивает файл из MinIO"""
        try:
            # Скачиваем файл из MinIO
            self.client.fget_object(CDN_BUCKET, object_name, download_path)
            logger.info(f"Файл {object_name} успешно скачан в {download_path}")
        except S3Error as e:
            logger.error(f"Ошибка при скачивании файла из MinIO: {e}")

    def delete_file(self, object_name: str):
        """Удаляет файл из MinIO"""
        try:
            # Удаляем объект из бакета
            self.client.remove_object(CDN_BUCKET, object_name)
            logger.info(f"Файл {object_name} удалён из MinIO")
        except S3Error as e:
            logger.error(f"Ошибка при удалении файла из MinIO: {e}")

    def get_file_url(self, object_name: str):
        """Получает URL для доступа к файлу в MinIO"""
        try:
            # Генерируем публичный URL для файла
            url = self.client.presigned_get_object(CDN_BUCKET, object_name)
            logger.info(f"URL для доступа к файлу: {url}")
            return url
        except S3Error as e:
            logger.error(f"Ошибка при получении URL для файла: {e}")
            return None

    def list_files(self):
        """Список объектов в бакете"""
        try:
            # Перечисляем объекты в бакете
            objects = self.client.list_objects(CDN_BUCKET)
            files = [obj.object_name for obj in objects]
            logger.info(f"Файлы в бакете {CDN_BUCKET}: {files}")
            return files
        except S3Error as e:
            logger.error(f"Ошибка при получении списка файлов: {e}")
            return []


minioClient = MinioClient()