from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi_mail import MessageSchema, MessageType
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.database import getDB
from src.manager import UserManager, ModerationManager
from src.util import JWT, Email, Redis, text_model, checkAuthorizationToken
from src.models import SignUpRequest, AuthResponse, Token, SignInRequest, TextModerationRequest, PredictResponse, \
    ModerationData, TextModeration, RolesEnum

auth_router = APIRouter()


@auth_router.post('/signup', response_model=AuthResponse)
async def signUp(data: SignUpRequest, db: AsyncSession = Depends(getDB)):
    user = await UserManager.createUser(data, db)
    token = JWT.generate(user.username)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


@auth_router.post('/signin', response_model=AuthResponse)
async def signIn(data: SignInRequest, db: AsyncSession = Depends(getDB)):
    user = await UserManager.getUser(data, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )

    token = JWT.generate(user.username)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


@auth_router.post('/verify', response_model=AuthResponse)
async def signIn(request: Request, db: AsyncSession = Depends(getDB)):
    token = checkAuthorizationToken(request)

    username = JWT.get_user(token)
    user = await UserManager.getUserByUsername(username, db)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


email_router = APIRouter()


@email_router.post('/request')
async def requestEmailVerification(request: Request, db: AsyncSession = Depends(getDB)) -> JSONResponse:
    token = checkAuthorizationToken(request)

    user = JWT.get_user(token)
    user = await UserManager.getUserByUsername(user, db)

    code = Email.generateCode()
    html = Email.getHTML(code)

    message = MessageSchema(
        subject="Email Verification",
        recipients=[user.email],
        body=html,
        subtype=MessageType.html
    )

    await Email.sendMail(message)
    Redis.setEmailVerificationCode(user.email, code)

    return JSONResponse(status_code=200, content={"message": "Email has been sent"})


@email_router.post('/verify')
async def emailVerification(
        request: Request,
        code: str,
        db: AsyncSession = Depends(getDB)
) -> JSONResponse:
    token = checkAuthorizationToken(request)

    username = JWT.get_user(token)
    user = await UserManager.getUserByUsername(username, db)
    valid_code = Redis.getEmailVerificationCode(user.email)
    if code == valid_code:
        await UserManager.verifyUser(user.id, db)
        return JSONResponse(status_code=200, content={"message": "Email verified"})

    raise HTTPException(
        status_code=422,
        detail="Wrong verification code"
    )


mod_router = APIRouter()


@mod_router.post("/text", response_model=PredictResponse)
async def moderate_text(
        APIToken: str,
        data: TextModerationRequest,
        request: Request,
        db: AsyncSession = Depends(getDB)
) -> PredictResponse:
    token = request.headers.get("Authorization", None)
    if token is None:
        Redis.addHTTPRequestCount(request.client.host)
    else:
        username = JWT.get_user(token.split(' ')[1])
        user = await UserManager.getUserByUsername(username, db)
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        tomorrow = datetime(now.year, now.month, now.day + 1)
        count = await ModerationManager.getCount(
            ModerationData(table=TextModeration, user_id=user.user_id),
            db,
            date_start=today,
            date_end=tomorrow
        )
        if user.role == RolesEnum.student and count >= 1000:
            raise HTTPException(
                status_code=429,
                detail="Your request limit is gone up"
            )

        await ModerationManager.addRequest(
            ModerationData(table=TextModeration, user_id=user.user_id),
            db,
            text=data.text
        )

    predictions = text_model.predict(data.text)
    return PredictResponse(**predictions)

# TODO: Check rate limit
