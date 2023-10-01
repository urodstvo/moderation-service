from fastapi import APIRouter, Request, HTTPException
from fastapi_mail import MessageSchema, MessageType, FastMail
from starlette.responses import JSONResponse
from src.email.models import EmailRequest, VerificationCode
from src.email.util import HTML_FOR_VERIFICATION, send_mail

email_router = APIRouter()


@email_router.post('/request')
async def requestEmailVerification(email: EmailRequest, request: Request) -> JSONResponse:
    if "Authorization" not in request.headers:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    email = email.email

    message = MessageSchema(
        subject="Email Verification",
        recipients=[email],
        body=HTML_FOR_VERIFICATION,
        subtype=MessageType.html
    )

    await send_mail(message)

    return JSONResponse(status_code=200, content={"message": "email has been sent"})


@email_router.post('/verify')
async def emailVerification(code: VerificationCode, request: Request) -> JSONResponse:
    if "Authorization" not in request.headers:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    return JSONResponse(status_code=200, content={"message": "email verified"})
