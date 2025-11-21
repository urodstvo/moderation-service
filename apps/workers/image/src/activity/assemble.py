from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
import enum

class ContentType(enum.Enum):
    AUDIO = "audio"
    VIDEO = "video"
    DOCUMENT = "document"
    UNKNOWN = "unknown"

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str

@dataclass
class OCRResult:
    id: int    
    original_filename: str
    filename: str
    text: str
    confidence: float
    language: str
    error: Optional[str] = None

@activity.defn
async def assemble_result(ocr_results: List[OCRResult]) -> List[ResultItem]:
    try:
        results = []
        successful_count = 0
        error_count = 0
        
        for ocr_result in ocr_results:            
            recognized_text = ocr_result.text if not ocr_result.error else ""
            result_item = ResultItem(
                id=ocr_result.id,
                original_filename=ocr_result.original_filename,
                filename=ocr_result.filename,
                recognized_text=recognized_text,
            )
            results.append(result_item)
            
            if ocr_result.error:
                error_count += 1
                activity.logger.warning(
                    f"File {ocr_result.filename} (ID: {ocr_result.id}) "
                    f"processed with error: {ocr_result.error}"
                )
            else:
                successful_count += 1
                activity.logger.info(
                    f"File {ocr_result.filename} (ID: {ocr_result.id}) "
                    f"successfully processed, text length: {len(recognized_text)}, "
                    f"confidence: {ocr_result.confidence:.3f}"
                )
        
        activity.logger.info(
            f"Assembled {len(results)} result items: "
            f"{successful_count} successful, {error_count} failed"
        )
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in assemble_result activity: {e}")
        raise