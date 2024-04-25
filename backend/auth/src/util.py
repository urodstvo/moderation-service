import datetime
from typing import Union

import bcrypt
import jwt

from src.config import JWT_SECRET, JWT_LIFETIME

from json import JSONEncoder
from uuid import UUID

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
