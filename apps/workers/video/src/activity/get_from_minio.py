from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
from minio_client import MinioClient

@dataclass
class VideoInput:
    id: int
    filename: str

@dataclass
class VideoResult:
    id: int
    filename: str
    video_bytes: bytes
    error: Optional[str] = None

@activity.defn
async def get_files_from_minio(videos: List[VideoInput]) -> List[VideoResult]:
    minio_client = MinioClient()
    
    try:
        results = []
        
        for video_input in videos:
            try:
                # Загружаем видеофайл из MinIO как bytes
                video_bytes = minio_client.get_file(video_input.filename)
                
                results.append(VideoResult(
                    id=video_input.id,
                    filename=video_input.filename,
                    video_bytes=video_bytes
                ))
                
                activity.logger.info(f"Successfully loaded video: {video_input.filename}")
                
            except Exception as file_error:
                activity.logger.error(f"Error loading video {video_input.filename}: {file_error}")
                results.append(VideoResult(
                    id=video_input.id,
                    filename=video_input.filename,
                    video_bytes=b"",
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in get_videos_from_minio activity: {e}")
        raise