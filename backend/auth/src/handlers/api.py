import os
import uuid

from fastapi import APIRouter, Request, HTTPException

from src.DTO.request import PredictionsResponse, PredictRequest, TextPredictResponse, LabelPredictResponse, \
    CreateRequestData
from src.db.base import AsyncSession
from src.util import get_userId_from_request, translate

from requests import get

from src.db.tables.requests import RequestsTable
from src.db.tables.profiles import ProfilesTable

from src.db.models import RequestModel, UserModel, ProfileModel

from src.util import check_auth

api_router = APIRouter()


#
# ---------------------- Rate limit ----------------------
#

async def checkRateLimit(user_id: uuid.UUID, db: AsyncSession):
    user = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if user.role != 'student':
        return

    count = await RequestsTable.countRequestOfToday(RequestModel(user_id=user_id), db)
    if count < 1000:
        return

    raise HTTPException(status_code=429, detail='Rate limit exceeded')


#
# ---------------------- Predict Text ----------------------
#
def classifyText(text: str, lang: str = 'auto') -> PredictionsResponse:
    translation = translate(text, lang)

    response = get(os.getenv("MODERATION_URL"), params={'query': translation})
    response = response.json()

    predictions = response['predictions'][0]
    toxicity = [LabelPredictResponse(label=label['label'], score=label['score']) for label in predictions['toxicity']]

    return PredictionsResponse(predictions=[TextPredictResponse(text=text, toxicity=toxicity)])


#
# ---------------------- Text ----------------------
#

@api_router.post("/text", response_model=PredictionsResponse)
async def text(data: PredictRequest, request: Request, db: AsyncSession):
    if await check_auth(request, db):
        user_id = get_userId_from_request(request)
        await checkRateLimit(user_id, db)
        await RequestsTable.createRequest(CreateRequestData(user_id=user_id, moderation_type="text", content=data.text),
                                          db)

    response = classifyText(data.text, data.lang)

    return response
