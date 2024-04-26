import datetime
import uuid

from pydantic import BaseModel, field_serializer


class ProfileResponse(BaseModel):
    profile_id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime
    role: str

    @field_serializer("user_id", 'profile_id', when_used='json')
    def serialize_uuid(self, value: uuid.UUID):
        return str(value)
