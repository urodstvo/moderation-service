import uuid
from typing import Union

from sqlalchemy import select, or_, and_, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, UserResponse, SignUpRequest, SignInRequest, ModerationData, TextModeration, GetUser, \
    UpdateUser


class UserManager:
    """Class for interacting with User Model"""

    @staticmethod
    async def createUser(data: SignUpRequest, db: AsyncSession) -> UserResponse:
        async with db as session:
            async with session.begin():
                user = User(username=data.username, password=data.password, email=data.email)
                session.add(user)
                await session.flush()
                return UserResponse(**user.as_dict())

    @staticmethod
    async def getUser(user_data: dict, db: AsyncSession) -> Union[UserResponse, None]:
        async with db as session:
            async with session.begin():
                user = await session.execute(select(User).filter_by(**user_data))
                user = user.first()[0]
                return None if user is None else UserResponse(**user.as_dict())

    @staticmethod
    async def updateUser(user_data: dict, update_data: dict, db: AsyncSession) -> None:
        async with db as session:
            async with session.begin():
                user = await session.execute(select(User).filter_by(**user_data))
                user = user.first()
                if user is None:
                    raise Exception("User doesn't exist")

                user.update(**update_data)
                await db.commit()


class ModerationManager:
    """Class for interacting with Moderation Table Model"""

    @staticmethod
    async def addRequest(data: ModerationData, db: AsyncSession, **kwargs):
        async with db as session:
            async with session.begin():
                request = data.table(user_id=data.user_id)
                if "text" in kwargs:
                    request.text = kwargs['text']

                session.add(request)
                await session.flush()

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
