import random
import string

from fastapi import APIRouter, HTTPException, Request

from src.db.base import AsyncSession
from src.db.models import UserModel, ProfileTable, ProfileModel
from src.db.tables.profiles import ProfilesTable
from src.db.tables.users import UsersTable
from src.util import get_userId_from_request

from starlette.responses import JSONResponse

roles = ['student', 'company']

profile_router = APIRouter()


#
# ---------------------- CHANGE ROLE -----------------------
#

@profile_router.put('/role/{role}')
async def change_role(request: Request, role: str, db: AsyncSession):
    if role not in roles:
        raise HTTPException(status_code=400, detail="Role not found")

    user_id = get_userId_from_request(request)
    user = await UsersTable.getUser(UserModel(user_id=user_id), db)

    if user is None:
        raise HTTPException(status_code=400, detail="User not found")

    if user.is_verified is not True:
        raise HTTPException(status_code=400, detail="User not verified")

    if role == 'student':
        await ProfilesTable.updateProfile(ProfileModel(user_id=user_id), ProfileModel(role=role), db)

    if role == 'company':
        await ProfilesTable.updateProfile(ProfileModel(user_id=user_id), ProfileModel(is_company_requested=True), db)

    return JSONResponse(content='Role Changed')


#
# ---------------------- ACCEPT COMPANY -----------------------
#

@profile_router.post('/accept/{user}')
async def change_role(request: Request, user: str, db: AsyncSession):
    user_id = get_userId_from_request(request)
    profile = await ProfilesTable.getUser(ProfileModel(user_id=user_id), db)

    if profile is None:
        raise HTTPException(status_code=403, detail="User not found")

    if profile.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")

    await ProfilesTable.updateProfile(ProfileModel(user_id=user), ProfileModel(is_company_requested=False,
                                                                               is_company_accepted=True,
                                                                               role='company'), db)

    return JSONResponse(content='Role Accepted')


#
# ---------------------- GET PROFILE -----------------------
#

@profile_router.get('/profile')
async def get_profile(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)

    if user_id is None:
        raise HTTPException(status_code=400, detail="User not found")

    profile = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if profile is None:
        raise HTTPException(status_code=400, detail="Profile not found")

    return profile


#
# -------------------- GENERATE API KEY -----------------------
#


@profile_router.post('/token')
async def generate_api_key(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)

    if user_id is None:
        raise HTTPException(status_code=400, detail="User not found")

    profile = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if profile.role == 'user':
        raise HTTPException(status_code=403, detail="Not allowed to generate token")

    token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(16))

    await ProfilesTable.updateProfile(ProfileModel(user_id=user_id), ProfileModel(api_token=token), db)

    return JSONResponse(content='Token Generated')
