from dataclasses import dataclass
from typing import List, Dict, Any, Optional

from temporalio import activity
from minio_client import MinioClient

@dataclass
class FileInput:
    id: int
    filename: str

@dataclass
class MinioResult:
    id: int
    filename: str
    text: str
    error: Optional[str] = None

@activity.defn
async def get_texts_from_minio(files: List[FileInput]) -> List[MinioResult]:
    minio_client = MinioClient()
    
    try:
        texts = []
        
        for file_input in files:
            try:
                data = minio_client.get_file(file_input.filename)
                text_content = data.decode('utf-8')                
                texts.append(MinioResult(
                    id=file_input.id,
                    filename=file_input.filename,
                    text=text_content
                ))
                
            except Exception as file_error:
                texts.append(MinioResult(
                    id=file_input.id,
                    filename=file_input.filename,
                    text=None,
                    error=str(file_error)
                ))
        
        return texts
        
    except Exception as e:
        activity.logger.error(f"Error in get_texts_from_minio activity: {e}")
        raise