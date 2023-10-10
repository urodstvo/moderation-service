import datetime
import enum
import uuid

from pydantic import BaseModel, EmailStr

from sqlalchemy import Column, Boolean, String, func, Integer, ForeignKey, INTEGER
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from src.database import Base


class RolesEnum(enum.Enum):
    user: str = "user"
    student: str = "student"
    company: str = "company"
    admin: str = "admin"


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String, primary_key=True, nullable=False, unique=True)


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    registered_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    role = Column(ForeignKey("roles.name", ondelete="SET DEFAULT"), default='user')

    # TODO: add hash to password


class ModerationTable:
    """Table for moderation service stats"""
    request_id = Column(INTEGER, primary_key=True, autoincrement=True, nullable=False)
    user_id = Column(ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
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


class AuthResponse(TunedModel):
    token: Token
    user: GetUserResponse


class EmailRequest(BaseModel):
    email: EmailStr


class TextModerationRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    toxic: float
    severe_toxic: float
    obscene: float
    threat: float
    insult: float
    identity_hate: float


class ModerationData(BaseModel):
    table: type.__class__
    id: int
    user_id: uuid.UUID
    requested_at: datetime.datetime
