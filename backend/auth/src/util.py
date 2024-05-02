import base64
import datetime
import os
from typing import Union

import bcrypt
import jwt
import requests

from .config import JWT_SECRET, JWT_LIFETIME

from json import JSONEncoder
from uuid import UUID

from fastapi import Request, HTTPException, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .db.base import AsyncSession
from .db.models import ProfileModel
from .db.tables.profiles import ProfilesTable


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
# ---------------------- API AUTHORIZATION -----------------------
#


async def check_auth(request: Request, db: AsyncSession) -> bool:
    if request.client.host == '172.18.0.1':
        return False

    token = request.headers.get('Authorization')
    if token is None:
        raise HTTPException(status_code=403, detail="No token provided")

    token = token.split(' ')
    if token[0] != 'Api-Key':
        raise HTTPException(status_code=403, detail="Invalid token type")

    user = await ProfilesTable.getProfile(ProfileModel(api_token=token[1]), db)
    if user is None:
        raise HTTPException(status_code=403, detail="Invalid token")

    if user.role == 'user':
        raise HTTPException(status_code=403, detail="Role is not allowed")

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
    except:
        raise HTTPException(detail="Invalid token", status_code=401)

    return payload.get('user_id')


#
# ---------------------- TRANSLATION -----------------------
#

translateMap = {
    'rus': 'ru'
}


def translate(text: str, lang: str = 'auto') -> str:
    body = {
        "targetLanguageCode": 'en',
        "texts": [text],
    }

    if lang != 'auto':
        body["sourceLanguageCode"] = translateMap[lang]

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Api-Key {os.getenv('YANDEX_API_KEY')}"
    }

    response = requests.post('https://translate.api.cloud.yandex.net/translate/v2/translate',
                             json=body,
                             headers=headers
                             )

    response = response.json()
    return response['translations'][0]['text']


#
# ---------------------- ENCODE BASE64 -----------------------
#

async def encode_base64(file: UploadFile) -> str:
    return base64.b64encode(await file.read()).decode('utf-8')
