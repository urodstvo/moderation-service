from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.manager import UserManager
from src.auth.models import SignUpRequest, AuthResponse, Token, SignInRequest
from src.auth.util import JWT
from src.database import getDB

auth_router = APIRouter()


@auth_router.post('/signup', response_model=AuthResponse)
async def signUp(data: SignUpRequest, db: AsyncSession = Depends(getDB)):
    user = await UserManager.createUser(data, db)
    token = JWT.generate_token({"exp": "date", "username": user.username})
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


@auth_router.post('/signin', response_model=AuthResponse)
async def signIn(data: SignInRequest, db: AsyncSession = Depends(getDB)):
    user = await UserManager.getUser(data, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )

    token = JWT.generate_token({"username": user.username, "id": user.user_id.hex})
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )
