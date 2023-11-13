import json
import os.path

import jwt
from keras.src.preprocessing.text import Tokenizer, tokenizer_from_json
from keras.preprocessing.sequence import pad_sequences
from keras.models import load_model

from src.config import JWT_SECRET, JWT_LIVETIME, AUTH_TOKEN_TYPE
from fastapi import HTTPException
import random
from datetime import timedelta, datetime
from fastapi_mail import FastMail, MessageSchema
from src.config import EmailConfig, redis


class Email:
    """class for email operations"""

    @staticmethod
    def getHTML(code: str) -> str:
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

    @staticmethod
    def generateCode() -> str:
        return ''.join([str(random.randint(0, 9)) for _ in range(4)])

    @staticmethod
    async def sendMail(message: MessageSchema):
        fm = FastMail(EmailConfig)
        await fm.send_message(message)


class JWT:
    """util class for jwt operations"""

    @staticmethod
    def generate(username: str):
        payload = dict()
        payload['exp'] = datetime.utcnow().timestamp()
        payload['username'] = username
        return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    @staticmethod
    def verify(token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET, ["HS256"], options={"verify_exp": False})
            exp = int(payload['exp'])
            return datetime.utcnow().timestamp() - exp < int(JWT_LIVETIME)
        except:
            raise HTTPException(status_code=400, detail="Invalid token")

    @staticmethod
    def getUser(token: str) -> str:
        payload = jwt.decode(token, JWT_SECRET, ["HS256"], options={"verify_exp": False})
        return payload["username"]


class Redis:
    """class for redis operations"""

    @staticmethod
    def setEmailVerificationCode(email: str, code: str):
        email = email[:email.find('@')]
        redis.set("verification_code_" + email, code)
        redis.expire("verification_code_" + email, timedelta(seconds=60))

    @staticmethod
    def getEmailVerificationCode(email: str) -> str:
        email = email[:email.find('@')]
        return redis.get("verification_code_" + email)

    @staticmethod
    def addHTTPRequestCount(name: str) -> None:
        key = "text_request_count_" + name
        count = redis.get(key)
        if count is None:
            redis.set(key, 1, ex=timedelta(days=1))
            return

        redis.set(key, int(count) + 1)

    @staticmethod
    def getHTTPRequestsCount(name: str) -> int:
        key = "text_request_count_" + name
        count = redis.get(key)
        return int(count) if count else 0


class AI:
    """class for working with keras models"""
    __source_dir = "AI"
    __tokenizer: Tokenizer
    __labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

    def __init__(self):
        self.__model = load_model(os.path.join(self.__source_dir, "model.h5"))
        with open(os.path.join(self.__source_dir, "tokenizer_dictionary.json"), encoding='utf-8') as f:
            data = json.load(f)
            data = json.dumps(data)
            self.__tokenizer = tokenizer_from_json(data)

    def predict(self, text: str) -> dict:
        sequences = self.__tokenizer.texts_to_sequences([text])
        padded_sequences = pad_sequences(sequences, maxlen=300, padding="post", truncating="post")
        predictions = self.__model.predict(padded_sequences)[0]

        result = dict()
        for ind, value in enumerate(self.__labels):
            result[value] = predictions[ind]

        return result


text_model = AI()


def checkAuthorizationToken(request):
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    token_type = token.split(' ')[0]
    if not token_type == AUTH_TOKEN_TYPE:
        raise HTTPException(
            status_code=400,
            detail="Invalid token type"
        )

    token = token.split(' ')[1]
    is_valid = JWT.verify(token)
    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Access token is time over"
        )

    return token


lang_map = {
    # "lang" : tuple of (pytesseract_code, google_recognizer_code)
    "en": ("eng", "en-US"),
    "rus": ("rus", "ru"),
}