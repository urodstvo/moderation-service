import datetime
from typing import Union

import bcrypt
import jwt

from .config import JWT_SECRET, JWT_LIFETIME

from json import JSONEncoder
from uuid import UUID

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


#
# ---------------------- JWT AUTHORIZATION -----------------------
#

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, token: str) -> bool:
        try:
            verify_jwt(token)
        except:
            return False

        return True


#
# ---------------------- SERIALIZER -----------------------
#

old_default = JSONEncoder.default


def new_serializer(self, obj):
    if isinstance(obj, UUID):
        return str(obj)
    return old_default(self, obj)


JSONEncoder.default = new_serializer


#
# ---------------------- HASH PASSWORDS -----------------------
#

def hash_password(plain):
    # Hash a password for the first time
    #   (Using bcrypt, the salt is saved into the hash itself)
    plain = plain.encode('utf-8')
    return bcrypt.hashpw(plain, bcrypt.gensalt())


def check_password(plain, hashed):
    # Check hashed password. Using bcrypt, the salt is saved into the hash itself
    plain = plain.encode('utf-8')
    hashed = hashed.encode('utf-8')
    return bcrypt.checkpw(plain, hashed)


#
# ---------------------- JWT -----------------------
#

def generate_jwt(payload: dict, lifetime: int = JWT_LIFETIME) -> str:
    data = dict()
    data['exp'] = datetime.datetime.utcnow().timestamp() + lifetime
    data.update(payload)
    return jwt.encode(data, JWT_SECRET, algorithm="HS256")


def verify_jwt(token: str) -> Union[dict, Exception]:
    try:
        payload = jwt.decode(token, JWT_SECRET, ["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Expired token")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def get_userId_from_request(request: Request) -> str:
    token = request.headers.get('Authorization').split(' ')[-1]

    try:
        payload = verify_jwt(token)
    except Exception as e:
        raise HTTPException(detail=e, status_code=401)

    return payload.get('user_id')
