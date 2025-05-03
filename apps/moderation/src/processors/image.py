from contextlib import contextmanager
import io
import os
import tempfile
from PIL import Image
import numpy as np

from src.minio import minioClient
from src.models import predict_segment, predict_ocr, YOLOResult

from typing import TypedDict, List

@contextmanager
def temp_image_from_minio(filename: str):
    """Контекстный менеджер: сохраняет изображение из MinIO во временный файл и удаляет его после использования"""
    data = minioClient.get_file(filename)
    
    # Приводим к Pillow Image
    image = Image.fromarray(data) if isinstance(data, np.ndarray) else Image.open(io.BytesIO(data))

    # Создаем временный файл
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
        image.save(tmp_file.name, format="JPEG")
        tmp_path = tmp_file.name

    try:
        yield tmp_path
    finally:
        os.remove(tmp_path)
        

class ImageProcessResult(TypedDict):
    objects: List[YOLOResult]
    text: str


class ImageProcessor:
    def __init__(self, filename: str):
        self.filename = filename

    # def _get_image_from_minio(self) -> str:
    #     """Загрузка изображения из MinIO и сохранение во временный файл"""
    #     # Загружаем изображение из MinIO
    #     obj = minioClient.client.get_object(CDN_BUCKET, self.filename)
    #     image_bytes = obj.read()

    #     # Загружаем изображение с помощью PIL
    #     image = Image.open(io.BytesIO(image_bytes))

    #     # Сохраняем изображение во временный файл
    #     with tempfile.NamedTemporaryFile(delete=False, suffix='.' + image.format.lower()) as tmp_file:
    #         image.save(tmp_file, format=image.format)
    #         tmp_path = tmp_file.name

    #     return tmp_path


    def process(self) -> ImageProcessResult:
        with temp_image_from_minio(self.filename) as img_path:
            return {
                "objects": self._object_recognition(img_path),
                "text": self._text_recognition(img_path)
            }

    def _object_recognition(self, img_path: str) -> List[YOLOResult]:
        return predict_segment(img_path)

    def _text_recognition(self, img_path: str) -> str:
        return predict_ocr(img_path)
