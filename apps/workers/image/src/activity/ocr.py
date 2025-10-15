import io
import cv2
import numpy as np
from dataclasses import dataclass
from typing import List, Optional, Tuple
from temporalio import activity
from PIL import Image
import easyocr

@dataclass
class OCRInput:
    id: int
    filename: str
    image_bytes: bytes

@dataclass
class OCRResult:
    id: int
    filename: str
    text: str
    confidence: float
    language: str
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
async def process_ocr(images: List[OCRInput]) -> List[OCRResult]:
    try:
        # Инициализируем EasyOCR reader для русского и английского
        reader = OCRProcessor.get_reader(['ru', 'en'])
        
        results = []
        
        for image_input in images:
            try:
                if not image_input.image_bytes:
                    raise ValueError("Empty image data")
                
                processed_image = _preprocess_image(image_input.image_bytes)
                ocr_results = reader.readtext(
                    processed_image,
                    detail=1,
                    paragraph=True,  # Группируем текст в параграфы
                    batch_size=1,    # Обрабатываем по одному изображению за раз
                    width_ths=0.5,   # Порог для объединения текстовых блоков
                    height_ths=0.5
                )
                
                all_text = []
                total_confidence = 0.0
                valid_results = 0
                
                for bbox, text, confidence in ocr_results:
                    if confidence > 0.1:  # Фильтруем результаты с низкой уверенностью
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
                    filename=image_input.filename,
                    text=combined_text,
                    confidence=avg_confidence,
                    language=language
                ))
                
                activity.logger.info(
                    f"Successfully processed OCR for {image_input.filename}, "
                    f"text length: {len(combined_text)}, "
                    f"confidence: {avg_confidence:.3f}"
                )
                
            except Exception as file_error:
                activity.logger.error(f"Error processing OCR for {image_input.filename}: {file_error}")
                results.append(OCRResult(
                    id=image_input.id,
                    filename=image_input.filename,
                    text="",
                    confidence=0.0,
                    language="",
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in process_ocr activity: {e}")
        raise