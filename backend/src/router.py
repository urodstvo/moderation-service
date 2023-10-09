from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi_mail import MessageSchema, MessageType
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.database import getDB
from src.manager import UserManager
from src.util import JWT, addRequestCount, send_mail, generateVerificationCode, htmlForVerification, setVerificationCode, \
    getVerificationCode
from src.models import SignUpRequest, AuthResponse, Token, SignInRequest, EmailRequest, VerificationData, \
    TextModerationRequest

auth_router = APIRouter()


@auth_router.post('/signup', response_model=AuthResponse)
async def signUp(data: SignUpRequest, db: AsyncSession = Depends(getDB)):
    user = await UserManager.createUser(data, db)
    token = JWT.generate_token({"exp": "date", "username": user.username})
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

    token = JWT.generate_token({"username": user.username, "id": user.user_id.hex})
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )




email_router = APIRouter()


@email_router.post('/request')
async def requestEmailVerification(email: EmailRequest, request: Request) -> JSONResponse:
    if "Authorization" not in request.headers:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    code = generateVerificationCode()
    html = htmlForVerification(code)
    email = email.email

    message = MessageSchema(
        subject="Email Verification",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    await send_mail(message)
    setVerificationCode(email, code)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})


@email_router.post('/verify')
async def emailVerification(
        request: Request,
        data: VerificationData,
        db: AsyncSession = Depends(getDB)
) -> JSONResponse:
    if "Authorization" not in request.headers:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    valid_code = getVerificationCode(data.email)
    if data.code == valid_code:
        await UserManager.verifyUser(data.email, db)
        return JSONResponse(status_code=200, content={"message": "email verified"})

    else:
        raise HTTPException(
            status_code=422,
            detail="Wrong code"
        )


# TODO: delete email field from request. Get user from token


mod_router = APIRouter()


@mod_router.post("/text")
async def moderate_text(
        APIToken: str,
        data: TextModerationRequest,
        request: Request,
        db: AsyncSession = Depends(getDB)
):
    if "Authorization" not in request.headers:
        addRequestCount(request.client.host)
    else:
        ...
    return {APIToken, data.text}
