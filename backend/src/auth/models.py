import datetime
import uuid
from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Boolean, String, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    registered_at = Column(TIMESTAMP, server_default=func.now())
    is_verified = Column(Boolean, default=False)


class TunedModel(BaseModel):
    class Config:
        """Convert all data(not dict too) to json"""
        from_attributes = True


class ShowUser(TunedModel):
    user_id: uuid.UUID
    username: str
    email: EmailStr
    is_verified: bool
    registered_at: datetime.datetime


class CreateUser(BaseModel):
    username: str
    email: EmailStr
    password: str
