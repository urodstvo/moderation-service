from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict
import asyncio

import httpx

from src.utils import CONFIG


@dataclass
class NsfwClassification:
    score: float
    is_nsfw: bool
    model: str


class NsfwModelClient(ABC):
    @abstractmethod
    async def analyze(self, image_bytes: bytes) -> NsfwClassification:
        raise NotImplementedError


class HttpNsfwModelClient(NsfwModelClient):
    def __init__(self, model_name: str, base_url: str):
        self.model_name = model_name
        self.base_url = base_url.rstrip("/")

    async def analyze(self, image_bytes: bytes) -> NsfwClassification:
        timeout = httpx.Timeout(60.0, connect=10.0)
        last_error = None

        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(
                        f"{self.base_url}/analyze",
                        files={"file": ("frame.jpg", image_bytes, "image/jpeg")},
                    )
                    response.raise_for_status()
                    payload = response.json()

                return NsfwClassification(
                    score=float(payload["score"]),
                    is_nsfw=bool(payload["is_nsfw"]),
                    model=str(payload.get("model", self.model_name)),
                )
            except (httpx.TimeoutException, httpx.HTTPError) as exc:
                last_error = exc
                if attempt == 2:
                    break
                await asyncio.sleep(2 ** attempt)

        raise last_error


_CLIENTS: Dict[str, NsfwModelClient] = {
    "clip": HttpNsfwModelClient("clip", CONFIG.ClipNsfwUrl),
    "falconsai": HttpNsfwModelClient("falconsai", CONFIG.FalconsaiNsfwUrl),
}


def get_nsfw_model_client(model_name: str) -> NsfwModelClient:
    try:
        return _CLIENTS[model_name]
    except KeyError as exc:
        raise ValueError(f"Unknown NSFW model: {model_name}") from exc
