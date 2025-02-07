import os
import uuid
import re

import io
from pydub import AudioSegment

import cv2
import numpy as np
import pytesseract
from PIL import Image
from fastapi import APIRouter, Request, HTTPException, UploadFile, File, Form

from src.DTO.request import *
from src.db.base import AsyncSession
from src.util import GoogleTranslate

from requests import get

import speech_recognition as sr

from moviepy.editor import VideoFileClip

from src.db.tables.requests import RequestsTable
from src.db.tables.profiles import ProfilesTable

from src.db.models import RequestModel, ProfileModel

from src.util import check_auth, encode_base64

from src.config import speech_recognizer, dirname



api_router = APIRouter()


#
# ---------------------- Rate limit ----------------------
#

async def checkRateLimit(user_id: uuid.UUID, db: AsyncSession):
    return
    user = await ProfilesTable.getProfile(ProfileModel(user_id=user_id), db)

    if user.role != 'student':
        return

    count = await RequestsTable.countRequestOfToday(RequestModel(user_id=user_id), db)
    if count < 1000:
        return

    raise HTTPException(status_code=429, detail='Rate limit exceeded')


#
# ---------------------- Predict Text ----------------------
#
async def classifyText(text: str, lang: str = 'auto') -> PredictionsResponse:
    translation = text
    if not lang == 'eng':
        translation = await GoogleTranslate(text)

    splitted = text.split('.')

    response = get(os.getenv("MODERATION_URL"), params={'query': translation})
    response = response.json()

    predictions = response['predictions']

    response = []

    ind = 0
    for predict in predictions:      
      toxicity = [LabelPredictResponse(label=label['label'], score=label['score']) for label in predict['toxicity']]
      response.append(TextPredictResponse(text=splitted[ind], toxicity=toxicity))
      ind += 1

    return PredictionsResponse(predictions=response)


#
# ---------------------- Text ----------------------
#

@api_router.post("/text", response_model=PredictionsResponse)
async def moderate_text(data: PredictRequest, request: Request, db: AsyncSession):
    isChecked, user_id = await check_auth(request, db)
    if isChecked:
        await checkRateLimit(user_id, db)
        await RequestsTable.createRequest(CreateRequestData(user_id=user_id, moderation_type="text", content=data.text),
                                          db)

    response = await classifyText(data.text, data.lang)

    return response


#
# ---------------------- IMAGE ----------------------
#


@api_router.post("/image", response_model=PredictionsResponse)
async def moderate_image(request: Request, db: AsyncSession, file: UploadFile = File(...), lang: str = Form(...)):
    # isChecked, user_id = await check_auth(request, db)
    # if isChecked:
    #     await checkRateLimit(user_id, db)
    #     create_data = CreateRequestData(user_id=user_id, moderation_type="image", content=await encode_base64(file))
    #     await RequestsTable.createRequest(create_data, db)
    print(file.content_type, lang)
    image = Image.open(file.file)

    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    image = cv2.resize(image, None, fx=5, fy=5, interpolation=cv2.INTER_CUBIC)

    image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

    image = cv2.medianBlur(image, 5)
    try:
        text: str = pytesseract.image_to_string(image, lang)

        text = re.sub(r'[\t\r\n\f\v]', ' ', text).strip()
    except:
        raise HTTPException(status_code=500, detail='Tesseract Error')
    if not text.strip():
        raise HTTPException(status_code=500, detail='No text found')
    response = await classifyText(text, lang)
    print('done')

    return response


#
# ---------------------- AUDIO ----------------------
#

languageMap = {
    'eng': 'en-US',
    'rus': 'ru-RU',
}


@api_router.post("/audio", response_model=PredictionsResponse)
async def moderate_audio(request: Request, db: AsyncSession, file: UploadFile = File(...), lang: str = Form(...)):
    isChecked, user_id = await check_auth(request, db)
    if isChecked:
        await checkRateLimit(user_id, db)
        create_data = CreateRequestData(user_id=user_id, moderation_type="audio", content=await encode_base64(file))
        await RequestsTable.createRequest(create_data, db)

    audio_content = await file.read()

    audio_io = io.BytesIO(audio_content)

    audio = AudioSegment.from_file(audio_io)
    wav_audio_io = io.BytesIO()
    audio.export(wav_audio_io, format="wav")
    wav_audio_io.seek(0)

    text = None

    with sr.AudioFile(wav_audio_io) as source:
        try:
            audio_data = speech_recognizer.record(source)
            text = speech_recognizer.recognize_google(audio_data, language=languageMap[lang])
        except:
            HTTPException(status_code=500, detail='No text found')

    if text is None:
        HTTPException(status_code=500, detail='No text found')

    return await classifyText(text, lang)


#
# ---------------------- VIDEO ----------------------
#

@api_router.post("/video", response_model=PredictionsResponse)
async def moderate_video(request: Request, db: AsyncSession, file: UploadFile = File(...), lang: str = Form(...)):
    # isChecked, user_id = await check_auth(request, db)
    # if isChecked:
    #     await checkRateLimit(user_id, db)
    #     create_data = CreateRequestData(user_id=user_id, moderation_type="video", content=await encode_base64(file))
    #     await RequestsTable.createRequest(create_data, db)

    import shutil
    file_location = dirname + f"/tmp/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)    

    filename, ext = os.path.splitext(file.filename)

    clip = VideoFileClip(file_location)
    clip.audio.write_audiofile(f"{dirname}/tmp/{filename}.wav")

    text = None

    with sr.AudioFile(f"{dirname}/tmp/{filename}.wav") as source:
        try:
            audio_data = speech_recognizer.record(source)
            text = speech_recognizer.recognize_google(audio_data, language=languageMap[lang])
        except:
            print('No text found')
            raise HTTPException(status_code=500, detail='No text found')

    if text is None:
        print('No text found')
        raise HTTPException(status_code=500, detail='No text found')

    print(text, lang)
    return await classifyText(text, lang)
