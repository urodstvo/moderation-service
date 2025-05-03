import io
import numpy as np
from src.minio import minioClient
from src.config import CDN_BUCKET
from src.models import predict_asr, predict_punctuation
from pydub import AudioSegment

from typing import Union, List

class AudioProcessor:
    def __init__(self, filename: str):
        self.filename = filename
        self.data = self._load_audio_from_minio()
        self.transcript = ""

    def _load_audio_from_minio(self) -> np.ndarray:
        """Загрузка аудиофайла из MinIO и преобразование в np.ndarray"""
        # Загружаем аудиофайл из MinIO
        obj = minioClient.client.get_object(CDN_BUCKET, self.filename)
        audio_bytes = obj.read()

        # Используем pydub для обработки байтового потока
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

        # Конвертируем аудио в моно и задаем частоту дискретизации 16kHz (стандарт для моделей Wav2Vec2)
        audio = audio.set_channels(1).set_frame_rate(16000)

        # Преобразуем аудио в массив NumPy (с преобразованием в формат float32)
        audio_array = np.array(audio.get_array_of_samples(), dtype=np.float32)

        # Нормализация данных в диапазоне [-1, 1]
        audio_array /= np.max(np.abs(audio_array))  # Приведение к нормированным значениям

        return audio_array

    def _speech_recognition(self) -> Union[str, List[str]]:
        """Распознавание речи"""
        result = predict_asr(self.data)
        if isinstance(result, bytes):
            result = result.decode("utf-8")
        self.transcript = result
        return result

    def _punctuation_recovering(self) -> Union[str, List[str]]:
        """Восстановление пунктуации"""
        result = predict_punctuation(self.transcript)
        if isinstance(result, bytes):
            result = result.decode("utf-8")
        return result

    def process(self) -> Union[str, List[str]]:
        """Основной пайплайн обработки аудио"""
        self._speech_recognition()
        return self._punctuation_recovering()
