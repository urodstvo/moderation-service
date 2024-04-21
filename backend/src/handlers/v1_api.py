import os
import uuid
from datetime import datetime, timedelta

import cv2
import numpy as np
import speech_recognition
from PIL import Image
from deep_translator import GoogleTranslator
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from moviepy.video.io.VideoFileClip import VideoFileClip
from pytesseract import pytesseract
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import API_TOKEN_TYPE, speech_recognizer, TEMP_DIR
from src.database import getDB
from src.manager import UserManager, ModerationManager
from src.models import PredictResponse, TextPredictRequest, RolesEnum, ModerationData, TextModeration, UserResponse, \
    ImageModeration, VideoModeration, AudioModeration
from src.util import text_model, lang_map


def checkAPIAuthorizationToken(request):
    token = request.headers.get("Authorization", None)
    if not token: raise HTTPException(status_code=401, detail="Unauthorized")
    token_type, token = token.split(' ')
    if token_type != API_TOKEN_TYPE: raise HTTPException(status_code=400,detail="Invalid token type")
    return token


async def checkRateLimit(user: UserResponse, table: type.__class__, db: AsyncSession):
    if user.role == RolesEnum.student.value:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        count = await ModerationManager.getCount(
            ModerationData(table=table, user_id=user.user_id),
            db,
            date_start=today,
            date_end=tomorrow
        )

        if count > 1000: raise HTTPException(status_code=429, detail="Rate limit")


v1_api_router = APIRouter()

def sort_predicts(predicts: dict) -> float:
    sum = 0.0
    for key in predicts:
        if key != 'toxic': sum += predicts[key]
    print(sum)
    return sum

@v1_api_router.post('/text', response_model=PredictResponse)
async def APITextModeration(
        data: TextPredictRequest,
        request: Request,
        db: AsyncSession = Depends(getDB)
) -> PredictResponse:
    token = checkAPIAuthorizationToken(request)
    user = await UserManager.getUser({"api_token": token}, db)
    await checkRateLimit(user, TextModeration, db)

    en_text = GoogleTranslator(source='auto', target='en').translate(data.text)
    texts = en_text.split('.')
    predictions = [text_model.predict(text) for text in texts]

    result = max(predictions, key=sort_predicts)
    await ModerationManager.addRequest(ModerationData(table=TextModeration, user_id=user.user_id), db, text=data.text)

    return PredictResponse(**result)

@v1_api_router.post("/image", response_model=PredictResponse)
async def moderateImage(
        request: Request,file: UploadFile = File(...),
        lang: str = Form('rus'),
        db: AsyncSession = Depends(getDB)
) -> PredictResponse:
    token = checkAPIAuthorizationToken(request)
    user = await UserManager.getUser({"api_token": token}, db)
    await checkRateLimit(user, TextModeration, db)


    image = Image.open(file.file)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    _, image = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY)
    image = cv2.medianBlur(image, 3)
    image = cv2.filter2D(image, -1, kernel=np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]]))
    text = pytesseract.image_to_string(image, lang=lang_map[lang][0])
    en_text = GoogleTranslator(source='auto', target='en').translate(text)
    predictions = text_model.predict(en_text)

    await ModerationManager.addRequest(ModerationData(table=ImageModeration, user_id=user.user_id), db)
    return PredictResponse(**predictions)


@v1_api_router.post("/audio", response_model=PredictResponse)
async def moderateAudio(
        request: Request,file: UploadFile = File(...),
        lang: str = Form('rus'),
        db: AsyncSession = Depends(getDB)
) -> PredictResponse:
    token = checkAPIAuthorizationToken(request)
    user = await UserManager.getUser({"api_token": token}, db)
    await checkRateLimit(user, TextModeration, db)

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
        text = speech_recognizer.recognize_google(audio, language=lang_map[lang][1])
        en_text = GoogleTranslator(source='auto', target='en').translate(text)
        predictions = text_model.predict(en_text)

        await ModerationManager.addRequest(ModerationData(table=AudioModeration, user_id=user.user_id), db)
        return PredictResponse(**predictions)
    except speech_recognition.UnknownValueError:
        raise HTTPException(
            status_code=400,
            detail='Could not understand audio'
        )


@v1_api_router.post("/video", response_model=PredictResponse)
async def moderateVideo(
        request: Request,file: UploadFile = File(...),
        lang: str = Form('rus'),
        db: AsyncSession = Depends(getDB)
) -> PredictResponse:
    token = checkAPIAuthorizationToken(request)
    user = await UserManager.getUser({"api_token": token}, db)
    await checkRateLimit(user, TextModeration, db)

    video_path = os.path.join(TEMP_DIR, f"{file.filename}-{uuid.uuid4()}")
    audio_path = os.path.join(TEMP_DIR, f"{file.filename.split('.')[0]}-{uuid.uuid4()}.wav")

    with open(video_path, "wb") as video_file:
        video_file.write(await file.read())

    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)
    video.close()

    audio = speech_recognition.AudioFile(audio_path)
    with audio as audio_file:
        audio = speech_recognizer.record(audio_file)

    text = speech_recognizer.recognize_google(audio, language=lang_map[lang][1])
    en_text = GoogleTranslator(source='auto', target='en').translate(text)
    predictions = text_model.predict(en_text)

    os.remove(video_path)
    os.remove(audio_path)

    await ModerationManager.addRequest(ModerationData(table=VideoModeration, user_id=user.user_id), db)
    return PredictResponse(**predictions)