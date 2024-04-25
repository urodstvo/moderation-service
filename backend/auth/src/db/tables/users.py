import uuid
from typing import Union

from sqlalchemy import select, update, and_

from src.DTO.auth import CreateUserData
from src.db.base import AsyncSession
from src.db.models import UserModel, UserTable


class UsersTable:
    """Class for interacting with User Model"""

    @staticmethod
    async def createUser(data: CreateUserData, db: AsyncSession) -> uuid.UUID:
        async with db.begin() as session:
            user = UserTable(password=data.password, email=data.email)
            session.add(user)
            await session.flush()
            return user.user_id

    @staticmethod
    async def getUser(user_data: UserModel, db: AsyncSession) -> Union[UserModel, None]:
        async with db.begin() as session:
            filtered_data = {key: value for key, value in user_data.dict().items() if value is not None}
            conditions = [getattr(UserTable, key) == value for key, value in filtered_data.items()]

            user = await session.execute(select(UserTable).where(and_(*conditions)))
            user = user.first()
            if user is None:
                return None

            return UserModel(**user[0].as_dict())

    @staticmethod
    async def updateUser(user_data: UserModel, update_data: UserModel, db: AsyncSession) -> None:
        async with db.begin() as session:
            await session.execute(update(UserTable).where(**user_data.dict()).values(**update_data))
            await session.commit()
