from typing import AsyncIterator, Annotated

from fastapi import Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from src.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, future=True, echo=True)

Base = declarative_base()

async_session = async_sessionmaker(engine, expire_on_commit=False)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


# Dependency
async def get_session() -> AsyncIterator[async_sessionmaker]:
    try:
        yield async_session
    except SQLAlchemyError as e:
        print("Async Session Error", e)

AsyncSession = Annotated[async_sessionmaker, Depends(get_session)]
