from dataclasses import dataclass
from typing import List, Optional
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
    audio_bytes: bytes
    error: Optional[str] = None

@activity.defn
async def get_files_from_minio(files: List[FileInput]) -> List[MinioResult]:
    minio_client = MinioClient()
    
    try:
        results = []
        
        for file_input in files:
            try:
                # Загружаем файл из MinIO как bytes
                audio_bytes = minio_client.get_file(file_input.filename)
                
                results.append(MinioResult(
                    id=file_input.id,
                    filename=file_input.filename,
                    audio_bytes=audio_bytes
                ))
                
                activity.logger.info(f"Successfully loaded file: {file_input.filename}")
                
            except Exception as file_error:
                activity.logger.error(f"Error loading file {file_input.filename}: {file_error}")
                results.append(MinioResult(
                    id=file_input.id,
                    filename=file_input.filename,
                    audio_bytes=b"",
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in get_files_from_minio activity: {e}")
        raise