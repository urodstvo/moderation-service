from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
from minio_client import MinioClient

@dataclass
class ImageInput:
    id: int
    filename: str

@dataclass
class ImageResult:
    id: int
    filename: str
    image_bytes: bytes
    error: Optional[str] = None

@activity.defn
async def get_images_from_minio(images: List[ImageInput]) -> List[ImageResult]:
    minio_client = MinioClient()
    
    try:
        results = []
        
        for image_input in images:
            try:
                # Загружаем изображение из MinIO как bytes
                image_bytes = minio_client.get_file(image_input.filename)
                
                results.append(ImageResult(
                    id=image_input.id,
                    filename=image_input.filename,
                    image_bytes=image_bytes
                ))
                
                activity.logger.info(f"Successfully loaded image: {image_input.filename}")
                
            except Exception as file_error:
                activity.logger.error(f"Error loading image {image_input.filename}: {file_error}")
                results.append(ImageResult(
                    id=image_input.id,
                    filename=image_input.filename,
                    image_bytes=b"",
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in get_images_from_minio activity: {e}")
        raise