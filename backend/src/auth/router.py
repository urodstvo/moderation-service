from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.manager import UserManager
from src.auth.models import ShowUser, CreateUser
from src.database import getDB

auth_router = APIRouter()


@auth_router.post('/user', response_model=ShowUser)
async def createUser(data: CreateUser, db: AsyncSession = Depends(getDB)):
    return await UserManager.createUser(data, db)
