import datetime
import uuid

from pydantic import BaseModel, EmailStr

from sqlalchemy import Column, String, func, ForeignKey, INTEGER
from sqlalchemy.dialects.postgresql import TIMESTAMP

from src.database import Base


class ModerationTable:
    """Table for moderation service stats"""
    request_id = Column(INTEGER, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(ForeignKey("users.user_id", ondelete="SET NULL"), nullable=False)
    requested_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)


class TextModeration(Base, ModerationTable):
    """table for text moderation statistic"""
    __tablename__ = "text_moderation"

    text = Column(String, nullable=False)


class TunedModel(BaseModel):
    class Config:
        """Convert all data(not dict too) to json"""
        from_attributes = True


class GetUserResponse(TunedModel):
    user_id: uuid.UUID
    username: str
    email: EmailStr
    is_verified: bool
    registered_at: datetime.datetime
    role: str


class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    login: str
    password: str


class Token(BaseModel):
    token: str
    type: str


class AuthResponse(BaseModel):
    token: Token
    user: GetUserResponse
