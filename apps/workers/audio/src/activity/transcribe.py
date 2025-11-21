import whisper
import numpy as np
import io
from pydub import AudioSegment
from dataclasses import dataclass
from typing import List, Optional
from temporalio import activity

@dataclass
class TranscriptionInput:
    id: int
    original_filename: str
    filename: str
    audio_bytes: bytes

@dataclass
class TranscriptionResult:
    id: int
    original_filename: str
    filename: str
    text: str
    language: str
    error: Optional[str] = None

def _bytes_to_audio_array(audio_bytes: bytes) -> np.ndarray:
    """Конвертирует байты аудио в np.ndarray для whisper"""
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
        audio = audio.set_channels(1).set_frame_rate(16000)
    
        audio_array = np.array(audio.get_array_of_samples(), dtype=np.float32)
        
        if len(audio_array) > 0:
            max_val = np.max(np.abs(audio_array))
            if max_val > 0:
                audio_array /= max_val
        
        return audio_array
        
    except Exception as e:
        raise Exception(f"Error converting audio bytes to array: {str(e)}")

@activity.defn
async def transcribe(audio_files: List[TranscriptionInput]) -> List[TranscriptionResult]:
    try:
        model = whisper.load_model("base")
        
        results = []
        
        for audio_file in audio_files:
            try:
                if not audio_file.audio_bytes:
                    raise ValueError("Empty audio data")
                
                audio_array = _bytes_to_audio_array(audio_file.audio_bytes)
                
                whisper_result = model.transcribe(
                    audio_array,
                    language='ru',
                    task='transcribe',
                    fp16=False,
                    no_speech_threshold=0.6  
                )
                
                results.append(TranscriptionResult(
                    id=audio_file.id,
                    original_filename=audio_file.original_filename,
                    filename=audio_file.filename,
                    text=whisper_result["text"].strip(),
                    language=whisper_result.get("language", "ru")
                ))
                
                activity.logger.info(f"Successfully transcribed: {audio_file.filename}")
                
            except Exception as file_error:
                activity.logger.error(f"Error transcribing file {audio_file.filename}: {file_error}")
                results.append(TranscriptionResult(
                    id=audio_file.id,
                    original_filename=audio_file.original_filename,
                    filename=audio_file.filename,
                    text="",
                    language="",
                    error=str(file_error)
                ))
        
        return results
        
    except Exception as e:
        activity.logger.error(f"Error in transcribe_audios activity: {e}")
        raise