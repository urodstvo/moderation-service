from io import BytesIO

import torch
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from pydantic import BaseModel
from transformers import AutoModelForImageClassification, ViTImageProcessor


MODEL_NAME = "Falconsai/nsfw_image_detection"

app = FastAPI(
    title="Falconsai NSFW API",
    description="NSFW image classification service based on Falconsai/nsfw_image_detection",
    version="1.0.0",
)

processor = ViTImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
model.eval()


class NsfwResponse(BaseModel):
    model: str
    score: float
    is_nsfw: bool


def _load_image(payload: bytes) -> Image.Image:
    image = Image.open(BytesIO(payload))
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image


@app.post("/analyze", response_model=NsfwResponse)
async def analyze_image(file: UploadFile = File(...)):
    image = _load_image(await file.read())

    with torch.no_grad():
        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    labels = {label.lower(): idx for idx, label in model.config.id2label.items()}
    nsfw_index = labels.get("nsfw")
    if nsfw_index is None:
        raise RuntimeError("NSFW label was not found in model config")

    score = float(probabilities[nsfw_index].item())
    return NsfwResponse(
        model="falconsai",
        score=score,
        is_nsfw=score >= 0.5,
    )
