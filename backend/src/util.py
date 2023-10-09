import jwt
from src.config import JWT_SECRET
from datetime import timedelta
from fastapi import HTTPException
import random
from datetime import timedelta
from fastapi_mail import FastMail, MessageSchema
from src.config import EmailConfig, redis


class JWT:
    """util class for jwt operations"""

    @staticmethod
    def generate_token(payload):
        return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    # TODO: add expires time param

    @staticmethod
    def verify_token(token: str):
        return jwt.decode(token, JWT_SECRET, algorithm="HS256")


async def send_mail(message: MessageSchema):
    fm = FastMail(EmailConfig)
    await fm.send_message(message)


def generateVerificationCode() -> str:
    return ''.join([str(random.randint(0, 9)) for _ in range(4)])


def setVerificationCode(email: str, code: str):
    email = email[:email.find('@')]
    redis.set("verification_code_" + email, code)
    redis.expire("verification_code_" + email, timedelta(seconds=60))


def getVerificationCode(email: str) -> str:
    email = email[:email.find('@')]
    return redis.get("verification_code_" + email)


def htmlForVerification(code: str) -> str:
    return f"""
    <html>
        <body>
            <style>

            </style>
            <table>
                <tr>
                    {' '.join([f"<td>{symbol}</td>" for symbol in code])}
                </tr>
            </table>
        </body>
    </html>
"""


def addRequestCount(host: str) -> None:
    key = "text_request_count_" + host
    count = redis.get(key)
    if count is None:
        redis.set(key, int(count) + 1, ex=timedelta(days=1))
        return

    if int(count) + 1 > 50:
        raise HTTPException(
            status_code=423,
            detail="Rate limit"
        )

    redis.set(key, int(count) + 1)


async def get_requests_count(username: str) -> int:
    return 0
