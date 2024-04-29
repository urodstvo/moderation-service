import datetime
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import Column, Boolean, String, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from .base import Base

import uuid


class UserTable(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    registered_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    role = Column(String, nullable=False, default='user')

    def as_dict(self):
        return {
            "user_id": self.user_id,
            "email": self.email,
            "password": self.password,
            "registered_at": self.registered_at,
            "updated_at": self.updated_at,
            "is_verified": self.is_verified,
            "role": self.role
        }


class UserModel(BaseModel):
    user_id: Optional[uuid.UUID] = None
    email: Optional[str] = None
    password: Optional[str] = None
    registered_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    is_verified: Optional[bool] = None
    role: Optional[str] = None


class ProfileTable(Base):
    __tablename__ = "profile"

    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    role = Column(String, nullable=False, default='user')
    is_company_requested = Column(Boolean, default=False, nullable=False)

    def as_dict(self):
        return {
            "profile_id": self.profile_id,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "role": self.role,
            'is_company_requested': self.is_company_requested
        }


class ProfileModel(BaseModel):
    profile_id: Optional[uuid.UUID] = None
    user_id: Optional[uuid.UUID] = None
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    role: Optional[str] = None
    is_company_requested: Optional[bool] = None