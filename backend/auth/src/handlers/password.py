from fastapi import HTTPException, APIRouter
from fastapi_mail import MessageSchema, FastMail, MessageType
from starlette.responses import JSONResponse

from src.config import MailConfig
import os

from src.DTO.password import ForgetPasswordRequest, ResetPasswordRequest
from src.db.base import AsyncSession
from src.db.models import UserModel
from src.db.tables.users import UsersTable
from src.util import generate_jwt, verify_jwt, hash_password

password_router = APIRouter()


#
# ---------------------- FORGOT PASSWORD -----------------------
#


@password_router.post('/forget')
async def forget_password(data: ForgetPasswordRequest, db: AsyncSession):
    user = await UsersTable.getUser(UserModel(email=data.email), db)

    if user is None:
        raise HTTPException(status_code=400, detail="Invalid Email address")

    secret_token = generate_jwt({'email': data.email}, 60 * 10)

    reset_password_link = f"{os.getenv('FRONTEND_URL')}{os.getenv('RESET_PASSWORD_LINK')}/{secret_token}"

    context = {"link_expiry_min": '10',
               "reset_link": reset_password_link}

    message = MessageSchema(
        subject="Password Reset Instructions",
        recipients=[data.email],
        template_body=context,
        subtype=MessageType.html
    )

    template_name = "email/password_reset.html"

    fm = FastMail(MailConfig)
    await fm.send_message(message, template_name)

    return JSONResponse(content="Email has been sent")


#
# ---------------------- RESET PASSWORD -----------------------
#

@password_router.post("/reset")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession):
    try:
        email = verify_jwt(data.token).get('email')
    except:
        raise HTTPException(detail="Invalid Password Reset Token", status_code=400)

    if email is None:
        raise HTTPException(detail="Invalid Password Reset Token Payload", status_code=400)

    await UsersTable.updateUser(UserModel(email=email), UserModel(password=hash_password(data.password)), db)

    return JSONResponse(content='Password Changed')
