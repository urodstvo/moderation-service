from typing import List

from pydantic import BaseModel


class ModerationTypeStats(BaseModel):
    total: int
    today: int


class ModerationStats(BaseModel):
    text: ModerationTypeStats
    image: ModerationTypeStats
    audio: ModerationTypeStats
    video: ModerationTypeStats


class UsersStats(BaseModel):
    total: int
    verified: int


class StatsResponse(BaseModel):
    moderation: ModerationStats
    users: UsersStats


class UserModerationRequests(BaseModel):
    text: int
    image: int
    audio: int
    video: int


class UserResponse(BaseModel):
    user_id: str
    email: str
    role: str
    is_verified: bool
    moderation: UserModerationRequests
    is_company_requested: bool
    is_company_accepted: bool


class UsersResponse(BaseModel):
    users: List[UserResponse]
