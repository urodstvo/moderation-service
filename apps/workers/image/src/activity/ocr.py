import io
import cv2
import numpy as np
from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
from PIL import Image
import easyocr

from .get_from_minio import get_images_from_minio
from src.models import NsfwClassification, get_nsfw_model_client

@dataclass
class Input:
    id: int
    original_filename: str
    filename: str

@dataclass
class OCRInput:
    id: int
    original_filename: str
    filename: str
    image_bytes: bytes

@dataclass
class OCRResult:
    id: int
    original_filename: str
    filename: str
    text: str
    confidence: float
    language: str
    nsfw_classification: Optional[NsfwClassification] = None
    error: Optional[str] = None

class OCRProcessor:
    _instance = None
    _reader = None
    
    @classmethod
    def get_reader(cls, languages: List[str] = ['ru', 'en']):
        if cls._reader is None:
            activity.logger.info(f"Initializing EasyOCR reader for languages: {languages}")
            cls._reader = easyocr.Reader(
                languages,
                gpu=False,  # Используем CPU для совместимости
                download_enabled=True
            )
        return cls._reader

def _preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Предобработка изображения для улучшения качества OCR
    """
    try:
        # Конвертируем bytes в PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Конвертируем в RGB если нужно
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Конвертируем в numpy array для OpenCV
        img_array = np.array(image)
        
        # Конвертируем RGB в BGR (формат OpenCV)
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        # Увеличиваем контраст с помощью CLAHE
        lab = cv2.cvtColor(img_array, cv2.COLOR_BGR2LAB)
        lab_planes = list(cv2.split(lab))
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        lab_planes[0] = clahe.apply(lab_planes[0])
        lab = cv2.merge(lab_planes)
        img_array = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
        
        # Убираем шум
        img_array = cv2.medianBlur(img_array, 3)
        
        return img_array
        
    except Exception as e:
        raise Exception(f"Image preprocessing failed: {str(e)}")

def _postprocess_text(text: str) -> str:
    """
    Постобработка распознанного текста
    """
    # Убираем лишние пробелы и переносы строк
    text = ' '.join(text.split())
    
    # Убираем специальные символы, но сохраняем буквы, цифры и пунктуацию
    import re
    text = re.sub(r'[^\w\s.,!?;:()-]', '', text)
    
    return text.strip()

@activity.defn
async def process_images(items: List[Input], model_name: str) -> List[OCRResult]:
    try:
        image_results = await get_images_from_minio(items)
        nsfw_client = get_nsfw_model_client(model_name)

        images = [
            OCRInput(
                id=result.id,
                original_filename=result.original_filename,
                filename=result.filename,
                image_bytes=result.image_bytes
            )
            for result in image_results
            if not result.error and result.image_bytes
        ]
    
        results = []
        reader = OCRProcessor.get_reader(['ru', 'en'])
        
        for image_input in images:
            combined_error = []
            try:
                if not image_input.image_bytes:
                    raise ValueError("Empty image data")

                nsfw_classification = None
                try:
                    nsfw_classification = await nsfw_client.analyze(image_input.image_bytes)
                except Exception as nsfw_error:
                    activity.logger.error(f"Error processing NSFW for {image_input.filename}: {nsfw_error}")
                    combined_error.append(f"nsfw: {nsfw_error}")

                processed_image = _preprocess_image(image_input.image_bytes)

                # TODO: moved to batched
                ocr_results = reader.readtext(
                    processed_image,
                    paragraph=True,
                    width_ths=0.5,
                    height_ths=0.5
                )

                all_text = []
                total_confidence = 0.0
                valid_results = 0

                for item in ocr_results:
                    if not isinstance(item, (list, tuple)) or len(item) < 2:
                        activity.logger.debug(f"Skipping invalid OCR item: {item}")
                        continue

                    text = item[1].strip()
                    if not text:
                        continue

                    confidence = 0.0
                    if len(item) > 2:
                        conf_field = item[2]
                        try:
                            if isinstance(conf_field, (list, tuple)):
                                confidences = [c for c in conf_field if isinstance(c, (int, float))]
                                if confidences:
                                    confidence = max(float(c) for c in confidences)
                            else:
                                confidence = float(conf_field or 0.0)
                        except (ValueError, TypeError) as e:
                            activity.logger.warning(f"Confidence parse error: {conf_field} — {e}")

                    all_text.append(text)
                    total_confidence += confidence
                    valid_results += 1

                combined_text = ' '.join(all_text)
                combined_text = _postprocess_text(combined_text)
                avg_confidence = total_confidence / valid_results if valid_results > 0 else 0.0

                language = "mixed"
                if combined_text:
                    ru_chars = len([c for c in combined_text if 'а' <= c <= 'я' or 'А' <= c <= 'Я'])
                    en_chars = len([c for c in combined_text if 'a' <= c <= 'z' or 'A' <= c <= 'Z'])

                    if ru_chars > en_chars * 2:
                        language = "ru"
                    elif en_chars > ru_chars * 2:
                        language = "en"
                    else:
                        language = "mixed"

                results.append(OCRResult(
                    id=image_input.id,
                    original_filename=image_input.original_filename,
                    filename=image_input.filename,
                    text=combined_text,
                    confidence=avg_confidence,
                    language=language,
                    nsfw_classification=nsfw_classification,
                    error='; '.join(combined_error) if combined_error else None,
                ))

                activity.logger.info(
                    f"Successfully processed image {image_input.filename}, "
                    f"text length: {len(combined_text)}, "
                    f"confidence: {avg_confidence:.3f}, "
                    f"nsfw_score: {nsfw_classification.score if nsfw_classification else 'n/a'}"
                )

            except Exception as file_error:
                activity.logger.error(f"Error processing image {image_input.filename}: {file_error}")
                results.append(OCRResult(
                    id=image_input.id,                    
                    original_filename=image_input.original_filename,
                    filename=image_input.filename,
                    text="",
                    confidence=0.0,
                    language="",
                    nsfw_classification=None,
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in process_images activity: {e}")
        raise
