import torch
from transformers import pipeline
from typing import Union, List

tagger_model_name = "IlyaGusev/rubertconv_toxic_editor"

device = "cuda" if torch.cuda.is_available() else "cpu"
device_num = 0 if device == "cuda" else -1
rubertconv = pipeline(
    "token-classification",
    model=tagger_model_name,
    tokenizer=tagger_model_name,
    framework="pt",
    device=device_num,
    aggregation_strategy="max"
)

def predict(texts: Union[str, List[str]]) -> List[dict]:
    if isinstance(texts, str):
        texts = [texts]
    predictions = rubertconv(texts, batch_size=1)
    return predictions[0] if len(predictions) == 1 else predictions