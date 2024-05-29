import random
import string

from fastapi import APIRouter, Request, HTTPException
from fastapi_mail import MessageSchema, MessageType, FastMail
from starlette.responses import JSONResponse

from src.DTO.email import VerifyEmailRequest
from src.config import MailConfig, redis
from src.db.base import AsyncSession
from src.db.models import UserModel
from src.db.tables.users import UsersTable
from src.util import get_userId_from_request

email_router = APIRouter()


def set_redis_key(key: str, value: str):
    redis.set(key, value, ex=60 * 2)


def get_redis_key(key: str) -> str:
    return redis.get(key)


#
# ---------------------- REQUEST VERIFICATION -----------------------
#

@email_router.post('/request')
async def request_verification(request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)
    user = await UsersTable.getUser(UserModel(user_id=user_id), db)

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid User Credentials")

    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    set_redis_key('email_verification:' + user_id, code)

    context = {"code": code}

    message = MessageSchema(
        subject="Password Reset Instructions",
        recipients=[user.email],
        template_body=context,
        subtype=MessageType.html
    )

    template_name = "email/email_verification.html"

    fm = FastMail(MailConfig)
    await fm.send_message(message, template_name)

    return JSONResponse(content="Email has been sent")


#
# ---------------------- VERIFY EMAIL -----------------------
#

@email_router.post("/verify")
async def verify_email(data: VerifyEmailRequest, request: Request, db: AsyncSession):
    user_id = get_userId_from_request(request)

    code = get_redis_key('email_verification:' + user_id)

    if code is None:
        raise HTTPException(status_code=400, detail="Expired verification code")

    if code != data.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    await UsersTable.updateUser(UserModel(user_id=user_id), UserModel(is_verified=True), db)

    return JSONResponse(content='Email Verified')
