from io import BytesIO

import open_clip
import torch
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from pydantic import BaseModel


MODEL_NAME = "ViT-B-32"
PRETRAINED = "laion2b_s34b_b79k"
PROMPTS = ["safe image", "nsfw image"]

app = FastAPI(
    title="CLIP NSFW API",
    description="CLIP-based NSFW image classification service inspired by LAION-AI/CLIP-based-NSFW-Detector",
    version="1.0.0",
)

device = "cuda" if torch.cuda.is_available() else "cpu"
model, _, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED)
tokenizer = open_clip.get_tokenizer(MODEL_NAME)
model = model.to(device)
model.eval()

with torch.no_grad():
    text_tokens = tokenizer(PROMPTS).to(device)
    text_features = model.encode_text(text_tokens)
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)


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
    image = preprocess(_load_image(await file.read())).unsqueeze(0).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        logits = 100.0 * image_features @ text_features.T
        probabilities = torch.softmax(logits, dim=-1)[0]

    score = float(probabilities[1].item())
    return NsfwResponse(
        model="clip",
        score=score,
        is_nsfw=score >= 0.5,
    )
