from fastapi import APIRouter, HTTPException, Request

from src.util import get_userId_from_request

from src.db.tables.profiles import ProfilesTable
from src.db.tables.requests import RequestsTable

from src.db.models import *

from src.db.base import AsyncSession

from src.db.tables.users import UsersTable

from src.DTO.admin import *

from sqlalchemy.orm import joinedload

from sqlalchemy import select


admin_router = APIRouter()


@admin_router.get("/stats", response_model=StatsResponse)
async def stats(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)
    profile = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if profile.role != 'admin':
        raise HTTPException(status_code=403, detail="Not allowed")

    text = ModerationTypeStats(
        total=len(await RequestsTable.getRequests(RequestModel(moderation_type='text'), db)),
        today=await RequestsTable.countRequestOfToday(RequestModel(moderation_type='text'), db)
    )

    image = ModerationTypeStats(
        total=len(await RequestsTable.getRequests(RequestModel(moderation_type='image'), db)),
        today=await RequestsTable.countRequestOfToday(RequestModel(moderation_type='image'), db)
    )

    audio = ModerationTypeStats(
        total=len(await RequestsTable.getRequests(RequestModel(moderation_type='audio'), db)),
        today=await RequestsTable.countRequestOfToday(RequestModel(moderation_type='audio'), db)
    )

    video = ModerationTypeStats(
        total=len(await RequestsTable.getRequests(RequestModel(moderation_type='video'), db)),
        today=await RequestsTable.countRequestOfToday(RequestModel(moderation_type='video'), db)
    )

    users = UsersStats(
        total=len(await UsersTable.getUsers(UserModel(), db)),
        verified=len(await UsersTable.getUsers(UserModel(is_verified=True), db))
    )

    moderation = ModerationStats(
        text=text,
        image=image,
        audio=audio,
        video=video
    )

    return StatsResponse(moderation=moderation, users=users)


@admin_router.get("/users", response_model=UsersResponse)
async def stats(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)
    profile = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if profile.role != 'admin':
        raise HTTPException(status_code=403, detail="Not allowed")

    async with db.begin() as session:
        query = await session.execute(select(UserTable, ProfileTable).join(ProfileTable).options(joinedload(UserTable.profile)))
        results = query.all()

    users = []
    for user, profile in results:
        users.append(UserResponse(
            user_id=str(user.user_id),
            email=user.email,
            role=profile.role,
            is_verified=user.is_verified,
            moderation=UserModerationRequests(
                text=len(await RequestsTable.getRequests(RequestModel(moderation_type='text', user_id=user.user_id), db)),
                image=len(await RequestsTable.getRequests(RequestModel(moderation_type='image', user_id=user.user_id), db)),
                audio=len(await RequestsTable.getRequests(RequestModel(moderation_type='audio', user_id=user.user_id), db)),
                video=len(await RequestsTable.getRequests(RequestModel(moderation_type='video', user_id=user.user_id), db)),
            ),
            is_company_requested=profile.is_company_requested,
            is_company_accepted=profile.is_company_accepted
        ))

    return UsersResponse(users=users)



