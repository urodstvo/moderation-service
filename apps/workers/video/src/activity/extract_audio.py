from datetime import datetime, timedelta, timezone
import subprocess
import tempfile
import os
from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity
from src.utils import minio_client as MINIO, CONFIG
from .get_from_minio import get_files_from_minio, VideoInput

@dataclass
class AudioExtractionResult:
    id: int
    original_filename: str
    filename: str
    error: Optional[str] = None

@activity.defn
async def extract_audio_from_video(input: List[VideoInput]) -> List[AudioExtractionResult]:
    video_files = get_files_from_minio(input)
    results = []
    minio_client = MINIO.client
    
    try:
       if not minio_client.bucket_exists(CONFIG.S3Bucket): 
           minio_client.make_bucket(CONFIG.S3Bucket)
    except Exception as e:
        activity.logger.error(f"MinIO initialization failed: {e}")
        return [
            AudioExtractionResult(
                id=video_file.id,
                audio_key="",
                filename=video_file.filename,
                error=f"Storage initialization failed: {str(e)}"
            )
            for video_file in video_files
        ]
    
    for video_file in video_files:        
        try:
            activity.logger.info(f"Processing: {video_file.filename}, size: {len(video_file.video_bytes)} bytes")
            
            if not video_file.video_bytes:
                raise ValueError("Empty video data")
            
            # Создаем временную директорию
            with tempfile.TemporaryDirectory() as temp_dir:
                video_path = os.path.join(temp_dir, "input.video")
                audio_path = os.path.join(temp_dir, "output.wav")
                
                with open(video_path, "wb") as f:
                    f.write(video_file.video_bytes)
                
                cmd = [
                    'ffmpeg', '-i', video_path, 
                    '-vn',                    # Без видео
                    '-acodec', 'pcm_s16le',   # Кодек
                    '-ac', '1',               # Моно
                    '-ar', '16000',           # Частота дискретизации
                    '-f', 'wav',              # Формат
                    '-y',                     # Перезаписать
                    audio_path
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
                
                if result.returncode != 0:
                    raise ValueError(f"FFmpeg error: {result.stderr}")
                
                if not os.path.exists(audio_path):
                    raise ValueError("Audio file not created")
                
                file_size = os.path.getsize(audio_path)
                if file_size < 1024:
                    raise ValueError(f"Audio file too small: {file_size} bytes")
                
                
                expiration_time = datetime.now(timezone.utc) + timedelta(hours=24)

                object_name = video_file.filename.rsplit('.', 1)[0] + ".wav"
                minio_client.fput_object(
                    CONFIG.S3Bucket,
                    object_name,
                    audio_path,
                    content_type="audio/wav",
                     metadata={
                        'x-amz-expiration': f"expiry-date=\"{expiration_time.strftime('%a, %d %b %Y %H:%M:%S GMT')}\""
                    }
                )
                
                activity.logger.info(f"Successfully extracted and uploaded audio: {object_name}, size: {file_size} bytes")
                
                results.append(AudioExtractionResult(
                    id=video_file.id,
                    filename=object_name,
                    original_filename=video_file.original_filename,
                ))
                
        except Exception as e:
            activity.logger.error(f"Error processing {video_file.filename}: {e}")
            results.append(AudioExtractionResult(
                id=video_file.id,
                filename=video_file.filename,                
                original_filename=video_file.original_filename,
                error=str(e)
            ))
    
    return results