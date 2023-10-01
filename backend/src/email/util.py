import random
from datetime import timedelta

from fastapi_mail import FastMail, MessageSchema

from src.config import EmailConfig, redis


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
