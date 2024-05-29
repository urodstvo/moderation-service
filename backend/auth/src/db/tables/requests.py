import uuid
from typing import Union, List
from datetime import timedelta, datetime
from sqlalchemy import select, update, and_
from src.DTO.request import CreateRequestData
from src.db.base import AsyncSession
from src.db.models import RequestTable, RequestModel


class RequestsTable:
    """Class for interacting with Request Model"""

    @staticmethod
    async def createRequest(data: CreateRequestData, db: AsyncSession) -> uuid.UUID:
        async with db.begin() as session:
            request = RequestTable(**data.dict())
            session.add(request)
            await session.flush()

            return request.request_id

    @staticmethod
    async def getRequest(request_data: RequestModel, db: AsyncSession) -> Union[RequestModel, None]:
        async with db.begin() as session:
            filtered_data = {key: value for key, value in request_data.dict().items() if value is not None}
            conditions = [getattr(RequestTable, key) == value for key, value in filtered_data.items()]

            request = await session.execute(select(RequestTable).where(and_(*conditions)))
            request = request.first()
            if request is None:
                return None

            return RequestModel(**request[0].as_dict())

    @staticmethod
    async def getRequests(request_data: RequestModel, db: AsyncSession) -> Union[List[RequestModel], None]:
        async with db.begin() as session:
            filtered_data = {key: value for key, value in request_data.dict().items() if value is not None}
            conditions = [getattr(RequestTable, key) == value for key, value in filtered_data.items()]

            rows = await session.execute(select(RequestTable).where(and_(*conditions)))
            if not rows:
                return None

            requests = []
            for row in rows:
                requests.append(RequestModel(**row[0].as_dict()))

            return requests

    @staticmethod
    async def updateRequest(request_data: RequestModel, update_data: RequestModel, db: AsyncSession) -> None:
        async with db.begin() as session:
            filtered_user_data = {key: value for key, value in request_data.dict().items() if value is not None}
            conditions = [getattr(RequestTable, key) == value for key, value in filtered_user_data.items()]

            filtered_update_data = {key: value for key, value in update_data.dict().items() if value is not None}

            await session.execute(update(RequestTable).where(and_(*conditions)).values(**filtered_update_data))
            await session.commit()

    @staticmethod
    async def countRequestOfToday(request_data: RequestModel, db: AsyncSession) -> int:
        async with db.begin() as session:
            filtered_user_data = {key: value for key, value in request_data.dict().items() if value is not None}
            conditions = [getattr(RequestTable, key) == value for key, value in filtered_user_data.items()]
            query = select(RequestTable).where(and_(*conditions))

            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            tomorrow = today + timedelta(days=1)
            query = query.where(RequestTable.created_at >= today)
            query = query.where(RequestTable.created_at < tomorrow)

            result = await session.execute(query)
            rows = result.fetchall()

            return len(rows) if rows is not None else 0
