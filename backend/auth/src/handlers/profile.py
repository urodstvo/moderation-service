from fastapi import APIRouter, HTTPException, Request

from src.db.base import AsyncSession
from src.db.models import UserModel, ProfileTable, ProfileModel
from src.db.tables.profiles import ProfilesTable
from src.db.tables.users import UsersTable
from src.util import get_userId_from_request

from fastapi.responses import JSONResponse

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

    match role:
        case 'student':
            await ProfileTables.updateProfile(ProfileModel(user_id=user_id), ProfileTable(role=role), db)
            return JSONResponse(content='Role changed')
        case 'company':
            await ProfileTables.updateProfile(ProfileModel(user_id=user_id), ProfileTable(is_company_requested=True), db)
            return JSONResponse(content='Role Changing Request Sent')
        case _:
            raise HTTPException(status_code=403, detail="You are not allowed to change this role")


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
