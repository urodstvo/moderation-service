import torch
from transformers import pipeline
from typing import Union, List


device_num = 0 if torch.cuda.is_available() else -1

sbert_punc = pipeline(
    "token-classification",
    model="kontur-ai/sbert_punc_case_ru",
    tokenizer="kontur-ai/sbert_punc_case_ru",
    device=device_num,
    aggregation_strategy="simple"
)

def _reconstruct_text(tokens: List[dict]) -> str:
    words = []
    for token in tokens:
        word = token["word"]
        entity = token.get("entity", "").lower()

        if "upper" in entity:
            word = word[0].upper() + word[1:]
        
        if "comma" in entity:
            word += ","
        elif "period" in entity:
            word += "."
        elif "question" in entity:
            word += "?"
        elif "exclam" in entity:
            word += "!"

        words.append(word)
    
    return " ".join(words).replace(" ,", ",").replace(" .", ".").replace(" !", "!").replace(" ?", "?")


def predict(texts: Union[str, List[str]]) -> Union[str, List[str]]:
    if isinstance(texts, str):
        result = sbert_punc(texts)
        return _reconstruct_text(result)
    else:
        return [_reconstruct_text(sbert_punc(t)) for t in texts]
