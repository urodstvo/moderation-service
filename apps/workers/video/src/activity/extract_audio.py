import subprocess
from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity

@dataclass
class AudioExtractionInput:
    id: int
    filename: str
    video_bytes: bytes

@dataclass
class AudioExtractionResult:
    id: int
    audio_bytes: bytes
    error: Optional[str] = None

def _extract_audio_in_memory(video_bytes: bytes) -> bytes:
    cmd = [
        'ffmpeg',
        '-i', 'pipe:0',           # Вход из stdin
        '-f', 'wav',              # Формат вывода WAV
        '-ac', '1',               # Моно
        '-ar', '16000',           # 16kHz
        '-acodec', 'pcm_s16le',   # PCM 16-bit
        '-y',                     # Перезаписать выходной файл без подтверждения
        'pipe:1'                  # Выход в stdout
    ]
    
    try:
        # Запускаем ffmpeg процесс
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=10**8  # Большой буфер для больших файлов
        )
        
        # Передаем видео байты и получаем аудио байты
        audio_bytes, stderr = process.communicate(input=video_bytes)
        
        if process.returncode != 0:
            error_msg = stderr.decode('utf-8', errors='ignore')
            raise Exception(f"FFmpeg error (code {process.returncode}): {error_msg}")
        
        return audio_bytes
        
    except Exception as e:
        raise Exception(f"FFmpeg processing failed: {str(e)}")

def _get_video_duration(video_bytes: bytes) -> float:
    cmd = [
        'ffmpeg',
        '-i', 'pipe:0',
        '-f', 'null',
        '-'
    ]
    
    try:
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=10**8
        )
        
        _, stderr = process.communicate(input=video_bytes)
        stderr_str = stderr.decode('utf-8', errors='ignore')
        
        for line in stderr_str.split('\n'):
            if 'Duration:' in line:
                duration_str = line.split('Duration:')[1].split(',')[0].strip()
                parts = duration_str.split(':')
                if len(parts) == 3:
                    hours = float(parts[0])
                    minutes = float(parts[1])
                    seconds = float(parts[2])
                    total_seconds = hours * 3600 + minutes * 60 + seconds
                    return total_seconds
        
        return 0.0
        
    except Exception:
        return 0.0

@activity.defn
async def extract_audio_from_video(video_files: List[AudioExtractionInput]) -> List[AudioExtractionResult]:
    try:
        results = []
        
        for video_file in video_files:
            try:
                if not video_file.video_bytes:
                    raise ValueError("Empty video data")
                
                duration = _get_video_duration(video_file.video_bytes)
                audio_bytes = _extract_audio_in_memory(video_file.video_bytes)
                
                if not audio_bytes:
                    raise ValueError("No audio data extracted")
                
                original_name = video_file.filename
                
                results.append(AudioExtractionResult(
                    id=video_file.id,
                    audio_bytes=audio_bytes,
                ))
                
                activity.logger.info(
                    f"Successfully extracted audio from {original_name}, "
                    f"duration: {duration:.2f}s, "
                    f"audio size: {len(audio_bytes)} bytes"
                )
                
            except Exception as file_error:
                activity.logger.error(f"Error extracting audio from {video_file.filename}: {file_error}")
                results.append(AudioExtractionResult(
                    id=video_file.id,
                    original_filename=video_file.filename,
                    audio_filename="",
                    audio_bytes=b"",
                    duration=0.0,
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in extract_audio_from_video activity: {e}")
        raise