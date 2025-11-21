from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
import enum

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str

@dataclass 
class TranscriptionResult:
    id: int    
    original_filename: str
    filename: str
    text: str
    language: str
    error: Optional[str] = None

@activity.defn
async def assemble_result(transcription_results: List[TranscriptionResult]) -> List[ResultItem]:
    try:
        results = []
        
        for trans_result in transcription_results:
            recognized_text = trans_result.text if not trans_result.error else ""
            result_item = ResultItem(
                id=trans_result.id,
                original_filename=trans_result.original_filename,
                filename=trans_result.filename,
                recognized_text=recognized_text
            )
            results.append(result_item)
            
            if trans_result.error:
                activity.logger.warning(
                    f"File {trans_result.filename} (ID: {trans_result.id}) "
                    f"processed with error: {trans_result.error}"
                )
            else:
                activity.logger.info(
                    f"File {trans_result.filename} (ID: {trans_result.id}) "
                    f"successfully transcribed, text length: {len(recognized_text)}"
                )
        
        activity.logger.info(f"Assembled {len(results)} result items")
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in assemble_result activity: {e}")
        raise
