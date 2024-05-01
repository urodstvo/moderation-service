import uuid
from typing import List, Optional

from pydantic import BaseModel


class CreateRequestData(BaseModel):
    user_id: uuid.UUID
    moderation_type: str
    content: str


class LabelPredictResponse(BaseModel):
    label: str
    score: float


class TextPredictResponse(BaseModel):
    text: str
    toxicity: List[LabelPredictResponse]


class PredictionsResponse(BaseModel):
    predictions: List[TextPredictResponse]


class PredictRequest(BaseModel):
    text: str
    lang: Optional[str] = 'auto'
