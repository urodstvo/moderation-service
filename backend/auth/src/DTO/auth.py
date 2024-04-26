import datetime
import uuid

from pydantic import BaseModel, EmailStr, field_serializer


class TunedModel(BaseModel):
    class Config:
        """Convert all data(not dict too) to json"""
        from_attributes = True


class Token(BaseModel):
    token: str
    type: str


class UserResponse(BaseModel):
    user_id: uuid.UUID
    email: EmailStr
    is_verified: bool
    registered_at: datetime.datetime
    updated_at: datetime.datetime

    @field_serializer("user_id", when_used='json')
    def serialize_uuid(self, value: uuid.UUID):
        return str(value)


class SignUpRequest(TunedModel):
    email: EmailStr
    password: str


class SignUpResponse(TunedModel):
    token: Token
    user: UserResponse


SignInRequest = SignUpRequest
SignInResponse = SignUpResponse


class CreateUserData(BaseModel):
    email: str
    password: str


