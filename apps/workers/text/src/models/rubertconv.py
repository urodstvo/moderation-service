from transformers import pipeline
from typing import Union, List
import torch

model_name = "IlyaGusev/rubertconv_toxic_editor"

device_num = 0 if torch.cuda.is_available() else -1
model = pipeline(
    "token-classification",
    model=model_name,
    tokenizer=model_name,
    framework="pt",
    device=device_num,
    aggregation_strategy="max"
)

class Model:
    def __init__(self):
        self.model = model

    def predict(self, texts: Union[str, List[str]]) -> List[dict]:
        if isinstance(texts, str):
            texts = [texts]
        predictions = self.model(texts, batch_size=1)
        return predictions[0] if len(predictions) == 1 else predictions

rubertconv = Model()
