# pull official base image
FROM python:3.11-slim-buster

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc postgresql build-essential python3-dev python3-setuptools tesseract-ocr libgl1 gcc make wget ffmpeg\
  && apt-get clean

# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .

RUN wget -O /usr/share/tesseract-ocr/4.00/tessdata/rus.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/rus.traineddata
