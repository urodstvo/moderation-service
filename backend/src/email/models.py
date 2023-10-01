from pydantic import BaseModel, EmailStr


class EmailRequest(BaseModel):
    email: EmailStr


class VerificationData(BaseModel):
    code: str
    email: EmailStr
