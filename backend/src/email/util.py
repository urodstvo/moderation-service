from fastapi_mail import FastMail, MessageSchema

from src.config import EmailConfig


async def send_mail(message: MessageSchema):
    fm = FastMail(EmailConfig)
    await fm.send_message(message)


HTML_FOR_VERIFICATION = """
    <html>
        <body>
            <style>
            
            </style>
            
        </body>
    </html>
"""