from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import API_TOKEN_TYPE
from src.database import getDB
from src.manager import UserManager, ModerationManager
from src.models import PredictResponse, TextPredictRequest, RolesEnum, ModerationData, TextModeration, UserResponse
from src.util import text_model

def checkAPIAuthorizationToken(request):
    token = request.headers.get("Authorization", None)
    if not token: raise HTTPException(status_code=401, detail="Unauthorized")
    token_type, token = token.split(' ')
    if token_type != API_TOKEN_TYPE: raise HTTPException(status_code=400,detail="Invalid token type")
    return token


async def checkRateLimit(user: UserResponse, table: type.__class__, db: AsyncSession):
    if user.role == RolesEnum.student.value:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        count = await ModerationManager.getCount(
            ModerationData(table=table, user_id=user.user_id),
            db,
            date_start=today,
            date_end=tomorrow
        )

        if count > 1000: raise HTTPException(status_code=429, detail="Rate limit")


v1_api_router = APIRouter()

@v1_api_router.post('/text', response_model=PredictResponse)
async def APITextModeration(data: TextPredictRequest, request: Request, db: AsyncSession = Depends(getDB)):
    token = checkAPIAuthorizationToken(request)

    text = data.text
    user = await UserManager.getUser({"api_token": token}, db)

    await checkRateLimit(user, TextModeration, db)

    await ModerationManager.addRequest(
        ModerationData(table=TextModeration, user_id=user.user_id),
        db,
        text=text
    )

    predictions = text_model.predict(data.text)
    return PredictResponse(**predictions)