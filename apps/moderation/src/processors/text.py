
from typing import Dict, List
from src.minio import minioClient
from src.config import CDN_BUCKET
from src.models import predict_detoxify, predict_detox_words
from src.helper import convert_float32_to_float

#TODO: change types
class TextProcessor:
    def __init__(self, filename: str = None, text: str = None):
        if filename:
            self.filename = filename
            self.text = self._get_text_from_minio()
        elif text:
            self.text = text
            self.filename = None
        else:
            raise ValueError("Either filename or text must be provided.")

    @classmethod
    def from_text(cls, text: str) -> 'TextProcessor':
        return cls(text=text)

    def _get_text_from_minio(self) -> str:
        obj = minioClient.client.get_object(CDN_BUCKET, self.filename)
        return obj.read().decode("utf-8")

    def _toxicicity_classification(self) -> Dict[str, float]:
        return convert_float32_to_float(predict_detoxify(self.text))

    def _phrase_retrieving(self) -> List[dict]:
        return convert_float32_to_float(predict_detox_words(self.text))

    def process(self) -> dict:
        return {
            "total_score": self._toxicicity_classification(),
            "phrases_score": self._phrase_retrieving()
        }