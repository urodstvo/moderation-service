import os

from fastapi_mail import ConnectionConfig

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_LIFETIME = os.getenv('JWT_LIFETIME')

DATABASE_URL = os.getenv('DATABASE_URL')

SENDER_GMAIL = os.getenv("SENDER_GMAIL")
SENDER_GMAIL_PASSWORD = os.getenv("SENDER_GMAIL_PASSWORD")

dirname = os.path.dirname(__file__)
templates_folder = os.path.join(dirname, 'templates')

MailConfig = ConnectionConfig(
    MAIL_USERNAME=SENDER_GMAIL,
    MAIL_PASSWORD=SENDER_GMAIL_PASSWORD,
    MAIL_FROM=SENDER_GMAIL,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Moderation Platform",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,
    TEMPLATE_FOLDER=templates_folder,
)
