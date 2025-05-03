import torch
import numpy as np
from typing import Union, List
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from pydub import AudioSegment
import io


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = Wav2Vec2Processor.from_pretrained("jonatasgrosman/wav2vec2-large-xlsr-53-russian")
model = Wav2Vec2ForCTC.from_pretrained("jonatasgrosman/wav2vec2-large-xlsr-53-russian").to(device)

# Функция для преобразования аудио в текст
def predict(audio: Union[np.ndarray, torch.Tensor, List[np.ndarray]]) -> Union[str, List[str]]:
    if isinstance(audio, (np.ndarray, torch.Tensor)):
        audio_input = audio
    elif isinstance(audio, list):
        audio_input = [np.array(AudioSegment.from_file(io.BytesIO(a)).set_channels(1).set_frame_rate(16000).get_array_of_samples()) for a in audio]
    else:
        raise TypeError("Unsupported input type for audio")

    # Подготовка данных для модели
    inputs = processor(audio_input, sampling_rate=16000, return_tensors="pt", padding=True).to(device_num)
    
    with torch.no_grad():
        logits = model(inputs.input_values).logits

    # Получаем предсказания
    predicted_ids = torch.argmax(logits, dim=-1)
    predicted_sentences = processor.batch_decode(predicted_ids)

    if isinstance(audio, list):
        return predicted_sentences
    else:
        return predicted_sentences[0]

