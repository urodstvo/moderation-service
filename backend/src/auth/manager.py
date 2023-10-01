from typing import Union

from sqlalchemy import select, or_, and_, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User, GetUserResponse, SignUpRequest, SignInRequest


class UserManager:
    """Class for interacting with User Model"""

    @staticmethod
    async def createUser(data: SignUpRequest, db) -> GetUserResponse:
        async with db as session:
            async with session.begin():
                user = User(username=data.username, password=data.password, email=data.email)
                session.add(user)
                await session.flush()
                return GetUserResponse(
                    user_id=user.user_id,
                    username=user.username,
                    email=user.email,
                    is_verified=user.is_verified,
                    registered_at=user.registered_at
                )

    @staticmethod
    async def getUser(data: SignInRequest, db: AsyncSession) -> Union[GetUserResponse, None]:
        async with db as session:
            async with session.begin():
                query = select(User).where(and_(or_(User.username == data.login,
                                                    User.email == data.login),
                                                User.password == data.password))
                res = await db.execute(query)
                user_row = res.fetchone()
                if user_row is not None:
                    user = user_row[0]
                    return GetUserResponse(
                        user_id=user.user_id,
                        username=user.username,
                        email=user.email,
                        is_verified=user.is_verified,
                        registered_at=user.registered_at
                    )

    @staticmethod
    async def getUserByUsername(username: str, db: AsyncSession) -> Union[GetUserResponse, None]:
        async with db as session:
            async with session.begin():
                query = select(User).where(User.username == username)
                res = await db.execute(query)
                user_row = res.fetchone()
                if user_row is not None:
                    user = user_row[0]
                    return GetUserResponse(
                        user_id=user.user_id,
                        username=user.username,
                        email=user.email,
                        is_verified=user.is_verified,
                        registered_at=user.registered_at
                    )

    @staticmethod
    async def verifyUser(email: str, db: AsyncSession) -> None:
        async with db as session:
            async with session.begin():
                query = update(User).where(User.email == email).values(is_verified=True)
                await db.execute(query)
