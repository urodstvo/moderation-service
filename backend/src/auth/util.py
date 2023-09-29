import jwt
from src.config import JWT_SECRET


class JWT:
    """util class for jwt operations"""

    @staticmethod
    def generate_token(payload):
        return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    # TODO: add expires time param

    @staticmethod
    def verify_token(token: str):
        return jwt.decode(token, JWT_SECRET, algorithm="HS256")
