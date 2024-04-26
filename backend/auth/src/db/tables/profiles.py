from typing import Union

from sqlalchemy import select, update, and_

from src.DTO.profile import *
from src.db.base import AsyncSession
from src.db.models import ProfileModel, ProfileTable


class ProfilesTable:
    """Class for interacting with Profile Model"""

    @staticmethod
    async def getProfile(user_data: ProfileModel, db: AsyncSession) -> Union[ProfileModel, None]:
        async with db.begin() as session:
            filtered_data = {key: value for key, value in user_data.dict().items() if value is not None}
            conditions = [getattr(ProfileTable, key) == value for key, value in filtered_data.items()]

            profile = await session.execute(select(ProfileTable).where(and_(*conditions)))
            profile = profile.first()
            if profile is None:
                return None

            return ProfileModel(**profile[0].as_dict())

    @staticmethod
    async def updateProfile(user_data: ProfileModel, update_data: ProfileModel, db: AsyncSession) -> None:
        async with db.begin() as session:
            filtered_user_data = {key: value for key, value in user_data.dict().items() if value is not None}
            conditions = [getattr(ProfileTable, key) == value for key, value in filtered_user_data.items()]

            filtered_update_data = {key: value for key, value in update_data.dict().items() if value is not None}

            await session.execute(update(ProfilesTable).where(and_(*conditions)).values(**filtered_update_data))
            await session.commit()
