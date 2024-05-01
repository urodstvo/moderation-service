import os

from fastapi import APIRouter, Request

from src.DTO.request import PredictionsResponse, PredictRequest
from src.db.base import AsyncSession
from src.util import get_userId_from_request, translate

from requests import get

api_router = APIRouter()


#
# ---------------------- Text ----------------------
#

@api_router.post("/text", response_model=PredictionsResponse)
async def text(data: PredictRequest, request: Request, db: AsyncSession):
    # user_id = get_userId_from_request(request)
    # await checkRateLimit(user, TextModeration, db)

    text = translate(data.text, data.lang)

    # en_text = GoogleTranslator(source='auto', target='en').translate(data.text)
    # texts = en_text.split('.')
    # predictions = [text_model.predict(text) for text in texts]
    # result = max(predictions, key=sort_predicts)
    # await ModerationManager.addRequest(ModerationData(table=TextModeration, user_id=user.user_id), db, text=data.text)

    response = get(os.getenv('MODERATION_URL'), params={'query': text})
    response = response.json()

    print(response)

    return PredictionsResponse(**response)

