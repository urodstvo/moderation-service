from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import getDB
from src.moderation.models import TextModerationRequest
from src.moderation.util import addRequestCount

mod_router = APIRouter()


@mod_router.post("/text")
async def moderate_text(
        APIToken: str,
        data: TextModerationRequest,
        request: Request,
        db: AsyncSession = Depends(getDB)
):
    if "Authorization" not in request.headers:
        addRequestCount(request.client.host)
    else:
        ...
    return {APIToken, data.text}

