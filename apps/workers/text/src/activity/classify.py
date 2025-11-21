from dataclasses import dataclass
from typing import Dict, List
from temporalio import activity
from src.models import detoxify

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

@activity.defn
async def classify_texts(texts: List[TextInput]) -> ClassificationResult:
    try:
        text_contents = [text_input.text for text_input in texts]        
        results = detoxify.predict(text_contents)
        
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