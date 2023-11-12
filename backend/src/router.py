import os
import uuid
from datetime import datetime

import cv2
import numpy as np
import pytesseract
import speech_recognition
from PIL import Image
from deep_translator import GoogleTranslator
from fastapi import APIRouter, HTTPException, status, Depends, Request, File, UploadFile
from fastapi_mail import MessageSchema, MessageType
from moviepy.video.io.VideoFileClip import VideoFileClip
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from src.config import speech_recognizer, TEMP_DIR
from src.database import getDB
from src.manager import UserManager, ModerationManager
from src.util import JWT, Email, Redis, text_model, checkAuthorizationToken
from src.models import SignUpRequest, AuthResponse, Token, SignInRequest, TextModerationRequest, PredictResponse, \
    RolesEnum, TextPredictRequest, ModerationData, TextModeration

auth_router = APIRouter()


@auth_router.post('/signup', response_model=AuthResponse)
async def signUp(data: SignUpRequest, db: AsyncSession = Depends(getDB)):
    if data.username == '' or data.email == '' or data.password == '':
        raise HTTPException(
            status_code=400,
            detail="Wrong input data"
        )
    user = await UserManager.createUser(data, db)
    token = JWT.generate(user.username)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


@auth_router.post('/signin', response_model=AuthResponse)
async def signIn(data: SignInRequest, db: AsyncSession = Depends(getDB)):
    user_data = {"password": data.password}
    if "@" in data.login:
        user_data["email"] = data.login
    else:
        user_data["username"] = data.login

    user = await UserManager.getUser(user_data, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )

    token = JWT.generate(user.username)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


@auth_router.get('/verify', response_model=AuthResponse)
async def verify(request: Request, db: AsyncSession = Depends(getDB)):
    token = checkAuthorizationToken(request)

    username = JWT.getUser(token)
    user = await UserManager.getUser({"username": username}, db)
    return AuthResponse(
        user=user,
        token=Token(token=token, type="Bearer")
    )


email_router = APIRouter()


@email_router.post('/request')
async def requestEmailVerification(request: Request, db: AsyncSession = Depends(getDB)) -> JSONResponse:
    token = checkAuthorizationToken(request)

    username = JWT.getUser(token)
    user = await UserManager.getUser({"username": username}, db)

    code = Email.generateCode()
    html = Email.getHTML(code)

    message = MessageSchema(
        subject="Email Verification",
        recipients=[user.email],
        body=html,
        subtype=MessageType.html
    )

    await Email.sendMail(message)
    Redis.setEmailVerificationCode(user.email, code)

    return JSONResponse(status_code=200, content={"message": "Email has been sent"})


@email_router.patch('/verify')
async def emailVerification(request: Request, code: str, db: AsyncSession = Depends(getDB)) -> JSONResponse:
    token = checkAuthorizationToken(request)

    username = JWT.getUser(token)
    user = await UserManager.getUser({"username": username}, db)

    valid_code = Redis.getEmailVerificationCode(user.email)
    if code == valid_code:
        await UserManager.updateUser({"user_id": user.user_id}, {"is_verified": True}, db)
        return JSONResponse(status_code=200, content={"message": "Email verified"})

    raise HTTPException(
        status_code=422,
        detail="Wrong verification code"
    )


mod_router = APIRouter()


@mod_router.post("/text", response_model=PredictResponse)
async def moderateText(data: TextModerationRequest) -> PredictResponse:
    en_text = GoogleTranslator(source='auto', target='en').translate(data.text)
    predictions = text_model.predict(en_text)
    return PredictResponse(**predictions)


# TODO: figure out how to recognize different langs better
@mod_router.post("/image", response_model=PredictResponse)
async def moderateImage(file: UploadFile = File(...)) -> PredictResponse:
    image = Image.open(file.file)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    _, image = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY)
    image = cv2.medianBlur(image, 3)
    image = cv2.filter2D(image, -1, kernel=np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]]))
    text = pytesseract.image_to_string(image, lang='rus')
    en_text = GoogleTranslator(source='auto', target='en').translate(text)
    predictions = text_model.predict(en_text)
    return PredictResponse(**predictions)


@mod_router.post("/audio", response_model=PredictResponse)
async def moderateAudio(file: UploadFile = File(...)) -> PredictResponse:
    try:
        # support wav format
        with speech_recognition.AudioFile(file.file) as source:
            audio = speech_recognizer.record(source)
    except:
        raise HTTPException(
            status_code=400,
            detail='Wrong audio format'
        )
    try:
        text = speech_recognizer.recognize_google(audio, language='ru-RU')
        en_text = GoogleTranslator(source='auto', target='en').translate(text)
        predictions = text_model.predict(en_text)
        return PredictResponse(**predictions)
    except speech_recognition.UnknownValueError:
        raise HTTPException(
            status_code=400,
            detail='Could not understand audio'
        )


@mod_router.post("/video", response_model=PredictResponse)
async def moderateVideo(file: UploadFile = File(...)) -> PredictResponse:
    video_path = os.path.join(TEMP_DIR, file.filename)
    audio_path = os.path.join(TEMP_DIR, f"{file.filename.split('.')[0]}.wav")

    with open(video_path, "wb") as video_file:
        video_file.write(await file.read())

    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)
    video.close()

    audio = speech_recognition.AudioFile(audio_path)
    with audio as audio_file:
        audio = speech_recognizer.record(audio_file)

    text = speech_recognizer.recognize_google(audio, language="ru-RU")
    en_text = GoogleTranslator(source='auto', target='en').translate(text)
    predictions = text_model.predict(en_text)

    os.remove(video_path)
    os.remove(audio_path)
    return PredictResponse(**predictions)



api_router = APIRouter()


@api_router.patch('/role/{role}')
async def changeRole(role: str, request: Request, db: AsyncSession = Depends(getDB)):
    role = role.lower()
    token = checkAuthorizationToken(request)
    username = JWT.getUser(token)
    user = await UserManager.getUser({"username": username}, db)
    if role == RolesEnum.student.value:
        if user.is_verified:
            await UserManager.updateUser({"user_id": user.user_id}, {"role": role}, db)
            return JSONResponse("Role was successfully changed to STUDENT")
        else:
            raise HTTPException(
                status_code=403,
                detail="Error. Your account doesnt verified."
            )

    # TODO: figure out func with COMPANY
    raise HTTPException(
        status_code=400,
        detail="Error. Invalid input role."
    )


@api_router.get('/token')
async def generateAPIToken(request: Request, db: AsyncSession = Depends(getDB)):
    token = checkAuthorizationToken(request)
    username = JWT.getUser(token)
    user = await UserManager.getUser({"username": username}, db)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )
    if user.role == RolesEnum.user.value:
        raise HTTPException(
            status_code=403,
            detail="This func doesnt acceptable for you"
        )

    api_token = user.api_token

    if not api_token:
        api_token = uuid.uuid4()
        await UserManager.updateUser({"user_id": user.user_id}, {"api_token": api_token}, db)

    return JSONResponse({"api_token": str(api_token)}, status_code=200)


v1_api_router = APIRouter()


@v1_api_router.post('/text', response_model=PredictResponse)
async def apiTextModeration(data: TextPredictRequest, request: Request, db: AsyncSession = Depends(getDB)):
    text = data.text
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    user = await UserManager.getUser({"api_token": token.split(' ')[1]}, db)

    if user.role == RolesEnum.student.value:
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        tomorrow = datetime(now.year, now.month, now.day + 1)
        count = await ModerationManager.getCount(
            ModerationData(table=TextModeration, user_id=user.user_id),
            db, date_start=today, date_end=tomorrow
        )

        if count > 1000:
            raise HTTPException(
                status_code=429,
                detail="Rate limit"
            )

    await ModerationManager.addRequest(
        ModerationData(table=TextModeration, user_id=user.user_id),
        db,
        text=text
    )

    predictions = text_model.predict(data.text)
    return PredictResponse(**predictions)
