

from fastapi import APIRouter, Depends, HTTPException, Response, Request

from src.db.base import AsyncSession
from src.DTO.auth import SignUpResponse, SignUpRequest, CreateUserData, Token, SignInResponse, SignInRequest, \
    UserResponse

from src.db.models import UserModel
from src.db.tables.users import UsersTable
from src.util import hash_password, generate_jwt, check_password, verify_jwt, get_userId_from_request

from src.util import JWTBearer

auth_router = APIRouter()


#
# ---------------------- SIGN UP -----------------------
#


@auth_router.post('/signup', response_model=SignUpResponse)
async def signUp(data: SignUpRequest, response: Response, db: AsyncSession):
    if data.email == '' or data.password == '':
        raise HTTPException(
            status_code=400,
            detail="Wrong input data"
        )

    user = await UsersTable.getUser(UserModel(email=data.email), db=db)

    if user is not None:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    user_data = CreateUserData(
        email=data.email,
        password=hash_password(data.password)
    )

    user_id = await UsersTable.createUser(user_data, db)
    user = await UsersTable.getUser(UserModel(user_id=user_id), db)

    access_token = generate_jwt({"user_id": user.user_id}, 60 * 15)
    refresh_token = generate_jwt({"user_id": user.user_id}, 60 * 60 * 24 * 7)

    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, max_age=60 * 60 * 24 * 7, expires=60 * 60 * 24 * 7)

    return SignUpResponse(
        user=UserResponse(**user.dict()),
        token=Token(token=access_token, type="Bearer")
    )


#
# ---------------------- SIGN IN -----------------------
#


@auth_router.post('/signin', response_model=SignInResponse)
async def signIn(data: SignInRequest, response: Response, db: AsyncSession):
    if data.email == '' or data.password == '':
        raise HTTPException(
            status_code=400,
            detail="Wrong input data"
        )

    user = await UsersTable.getUser(UserModel(email=data.email), db)
    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Incorrect login or password",
        )

    if not check_password(data.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect login or password",
        )

    access_token = generate_jwt({"user_id": user.user_id}, 60 * 15)
    refresh_token = generate_jwt({"user_id": user.user_id}, 60 * 60 * 24 * 7)


    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, max_age=60 * 60 * 24 * 7, expires=60 * 60 * 24 * 7)

    return SignInResponse(
        user=UserResponse(**user.dict()),
        token=Token(token=access_token, type="Bearer")
    )


#
# ---------------------- REFRESH -----------------------
#


@auth_router.get('/refresh', response_model=Token)
async def refresh(request: Request):
    token = request.cookies.get("refresh_token")

    if token is None:
        raise HTTPException(status_code=401, detail="Not authorized")

    try:
        payload = verify_jwt(token)
    except Exception as e:
        raise HTTPException(detail=e, status_code=401)

    access_token = generate_jwt({"user_id": payload['user_id']}, 60 * 15)

    return Token(
        token=access_token,
        type="Bearer"
    )


#
# ---------------------- VERIFY -----------------------
#

@auth_router.get('/verify', dependencies=[Depends(JWTBearer())], response_model=UserResponse)
async def verify(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)

    user = await UsersTable.getUser(UserModel(user_id=user_id), db)

    if user is None:
        raise HTTPException(status_code=400, detail="User not found")

    return user


