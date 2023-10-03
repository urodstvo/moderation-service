from typing import Generator

from src.config import DATABASE_URL

from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base

Base = declarative_base()

engine = create_async_engine(DATABASE_URL, future=True, echo=True)

async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def getDB() -> Generator:
    """Dependency for getting async session"""
    session: AsyncSession = async_session()
    try:
        yield session
    finally:
        await session.close()
