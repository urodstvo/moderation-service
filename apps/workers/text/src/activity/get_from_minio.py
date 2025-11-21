from dataclasses import dataclass
from typing import List, Optional
from src.utils import minio_client

from temporalio import activity
from minio_client import MinioClient

@dataclass
class FileInput:
    id: int
    original_filename: str
    filename: str

@dataclass
class MinioResult:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    error: Optional[str] = None

async def get_texts_from_minio(files: List[FileInput]) -> List[MinioResult]:
    try:
        texts = []
        
        for file_input in files:
            try:
                data = minio_client.get_file(file_input.filename)
                text_content = data.decode('utf-8')                
                texts.append(MinioResult(
                    id=file_input.id,
                    original_filename=file_input.original_filename,
                    filename=file_input.filename,
                    recognized_text=text_content
                ))
                
            except Exception as file_error:
                texts.append(MinioResult(
                    id=file_input.id,
                    original_filename=file_input.original_filename,
                    filename=file_input.filename,
                    recognized_text=None,
                    error=str(file_error)
                ))
        
        return texts
        
    except Exception as e:
        activity.logger.error(f"Error in get_texts_from_minio activity: {e}")
        raise