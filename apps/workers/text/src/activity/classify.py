from dataclasses import dataclass
from typing import Dict, List
from temporalio import activity
from src.models import detoxify
from transformers import AutoTokenizer

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

@activity.defn
async def classify_texts(texts: List[TextInput]) -> ClassificationResult:
    try:
        # Предварительная обработка текстов - обрезка слишком длинных
        processed_texts = []
        for text_input in texts:
            text = text_input.text
            # Проверяем длину текста и обрезаем если нужно
            if estimate_token_count(text) > 512:
                activity.logger.warning(
                    f"Text {text_input.id} too long, truncating. "
                    f"Original tokens: {estimate_token_count(text)}"
                )
                text = truncate_text(text, max_length=500)
            processed_texts.append(text)
        
        # Классификация с помощью detoxify
        results = detoxify.predict(processed_texts)
        
        classification_results: Dict[int, Classification] = {}
        for i, text_input in enumerate(texts):
            classification_results[text_input.id] = Classification(
                toxicity=results['toxicity'][i],
                severe_toxicity=results['severe_toxicity'][i],
                obscene=results['obscene'][i],
                threat=results['threat'][i],
                insult=results['insult'][i],
                identity_attack=results['identity_attack'][i]
            )

        return classification_results
        
    except Exception as e:
        activity.logger.error(f"Error in classify_texts activity: {e}")
        raise