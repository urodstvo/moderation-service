from dataclasses import dataclass
from typing import Dict, List
from temporalio import activity

import asyncio
import httpx
from transformers import AutoTokenizer
from src.utils import CONFIG


@dataclass
class TextInput:
    id: int
    text: str


@dataclass
class Classification:
    toxicity: float
    severe_toxicity: float
    obscene: float
    threat: float
    insult: float
    identity_attack: float


ClassificationResult = Dict[int, Classification]

# --- Токенизатор для обрезки текста ---
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")


def truncate_text(text: str, max_length: int = 500) -> str:
    """Обрезает текст до максимального количества токенов"""
    tokens = tokenizer.encode(
        text,
        truncation=True,
        max_length=max_length,
        add_special_tokens=True
    )
    truncated_text = tokenizer.decode(tokens, skip_special_tokens=True)
    return truncated_text


def estimate_token_count(text: str) -> int:
    """Оценивает количество токенов в тексте"""
    tokens = tokenizer.encode(text, add_special_tokens=False)
    return len(tokens)


async def call_model_api(url: str, text: str) -> Dict:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, json={"text": text})
        response.raise_for_status()
        return response.json()


@activity.defn
async def classify_texts(texts: List[TextInput], model: str) -> ClassificationResult:
    try:
        # 1) Предобработка текстов
        processed_texts = []
        for t in texts:
            text = t.text
            if estimate_token_count(text) > 512:
                activity.logger.warning(
                    f"Text {t.id} too long, truncating. "
                    f"Original tokens: {estimate_token_count(text)}"
                )
                text = truncate_text(text, max_length=500)
            processed_texts.append(text)

        # 2) Выбор URL сервиса по модели
        if model == "detoxify":
            url = CONFIG.DetoxifyUrl
        elif model == "rubert":
            url = CONFIG.RubertUrl
        elif model == "classifier":
            url = CONFIG.ClassifierUrl
        else:
            raise ValueError(f"Unknown model: {model}")
        
        url += "/analyze"

        # 3) Параллельные запросы к сервису (один текст = один запрос)
        tasks = [call_model_api(url, text) for text in processed_texts]
        results = await asyncio.gather(*tasks)

        # 4) Нормализация результата
        classification_results: Dict[int, Classification] = {}
        for i, text_input in enumerate(texts):
            r = results[i]

            if model == "detoxify":
                # Detoxify возвращает все поля
                toxicity = r["toxicity"]
                severe_toxicity = r["severe_toxicity"]
                obscene = r["obscene"]
                threat = r["threat"]
                insult = r["insult"]
                identity_attack = r["identity_attack"]
            else:
                # Бинарные модели: переводим probability -> 0/1
                toxicity = 1 if r["toxicity"] >= 0.5 else 0
                severe_toxicity = 0
                obscene = 0
                threat = 0
                insult = 0
                identity_attack = 0

            classification_results[text_input.id] = Classification(
                toxicity=toxicity,
                severe_toxicity=severe_toxicity,
                obscene=obscene,
                threat=threat,
                insult=insult,
                identity_attack=identity_attack,
            )

        return classification_results

    except Exception as e:
        activity.logger.error(f"Error in classify_texts activity: {e}")
        raise
