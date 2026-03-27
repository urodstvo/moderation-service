from fastapi import FastAPI
from pydantic import BaseModel
from detoxify import Detoxify

app = FastAPI(
    title="Detoxify API",
    description="API для анализа токсичности текста",
    version="1.0.0"
)

model = Detoxify("multilingual")

class TextRequest(BaseModel):
    text: str

class DetoxifyResponse(BaseModel):
    toxicity: float
    severe_toxicity: float
    obscene: float
    threat: float
    insult: float
    identity_attack: float


@app.post("/analyze", response_model=DetoxifyResponse)
def analyze_text(request: TextRequest):
    result = model.predict(request.text)
    return result
