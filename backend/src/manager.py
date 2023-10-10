import uuid
from typing import Union

from sqlalchemy import select, or_, and_, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, GetUserResponse, SignUpRequest, SignInRequest, ModerationData, TextModeration


class UserManager:
    """Class for interacting with User Model"""

    @staticmethod
    async def createUser(data: SignUpRequest, db: AsyncSession) -> GetUserResponse:
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
                    registered_at=user.registered_at,
                    role=user.role
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
                        registered_at=user.registered_at,
                        role=user.role
                    )

    @staticmethod
    async def getUserByUsername(username: str, db: AsyncSession) -> Union[User, None]:
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
                        registered_at=user.registered_at,
                        role=user.role
                    )

    @staticmethod
    async def verifyUser(user_id: uuid.UUID, db: AsyncSession) -> None:
        async with db as session:
            async with session.begin():
                query = update(User).where(User.id == user_id).values(is_verified=True)
                await db.execute(query)


class ModerationManager:
    """Class for interacting with Moderation Table Model"""

    @staticmethod
    async def addRequest(data: ModerationData, db: AsyncSession, **kwargs):
        async with db as session:
            async with session.begin():
                request = data.table(user_id=data.user_id)
                if "text" in kwargs:
                    request.text = kwargs['text']
                # request = TextModeration(user_id=data.user_id, text=data.text)

                session.add(request)
                await session.flush()

                # TODO: check if working that

    @staticmethod
    async def getCount(data: ModerationData, db: AsyncSession, **kwargs) -> int:
        """kwargs contains fields for filter select"""
        async with db as session:
            async with session.begin():
                query = select(TextModeration)
                if data.user_id is not None:
                    query = query.where(data.table.user_id == data.user_id)

                if 'date_start' in kwargs:
                    query = query.where(data.table.requested_at >= kwargs['date_start'])

                if 'date_end' in kwargs:
                    query = query.where(data.table.requested_at <= kwargs['date_end'])

                result = await session.execute(query)
                rows = result.fetchall()
                return len(rows) if rows is not None else 0
