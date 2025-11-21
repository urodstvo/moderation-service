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
        results = []
        reader = OCRProcessor.get_reader(['ru', 'en'])
        
        for image_input in images:
            try:
                if not image_input.image_bytes:
                    raise ValueError("Empty image data")
                
                processed_image = _preprocess_image(image_input.image_bytes)
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
                    original_filename=image_input.original_filename,
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