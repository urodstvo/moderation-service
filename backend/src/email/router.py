from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi_mail import MessageSchema, MessageType
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.auth.manager import UserManager
from src.database import getDB
from src.email.models import EmailRequest, VerificationData
from src.email.util import send_mail, generateVerificationCode, htmlForVerification, setVerificationCode, \
    getVerificationCode

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

# TODO: check if authorization token valid for input email
