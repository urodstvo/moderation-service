import json
import os.path
from typing import Union

import jwt
from keras.src.preprocessing.text import Tokenizer, tokenizer_from_json
from keras.preprocessing.sequence import pad_sequences
from keras.models import load_model

from src.config import JWT_SECRET
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
        redis.set(key, 1, ex=timedelta(days=1))
        return

    if int(count) + 1 > 50:
        raise HTTPException(
            status_code=423,
            detail="Rate limit"
        )

    redis.set(key, int(count) + 1)


async def get_requests_count(host: str) -> Union[int, None]:
    key = "text_request_count_" + host
    count = redis.get(key)
    return int(count) if count else None


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

        print(result)
        return result


text_model = AI()

# text_model.predict("kill yourself")
# text_model.predict("i'm so happy")
# text_model.predict("I hate you, fucking dumb, please kill yourself, nigger")
