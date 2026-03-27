from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

app = FastAPI(
    title="RuBERT Toxic API",
    description="API для определения токсичности русского текста",
    version="1.0.0"
)

MODEL_NAME = "sismetanin/rubert-toxic-pikabu-2ch"

# Загружаем модель и токенизатор при старте
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

class TextRequest(BaseModel):
    text: str

class ToxicResponse(BaseModel):
    toxic: float
    non_toxic: float
    is_toxic: bool


@app.post("/analyze", response_model=ToxicResponse)
def analyze_text(request: TextRequest):
    inputs = tokenizer(
        request.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)[0]

    non_toxic_prob = probs[0].item()
    toxic_prob = probs[1].item()

    return {
        "toxic": toxic_prob,
        "non_toxic": non_toxic_prob,
        "is_toxic": toxic_prob >= 0.5
    }
