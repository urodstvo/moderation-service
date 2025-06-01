from detoxify import Detoxify
from typing import Union, List, Dict
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
detoxify = Detoxify('multilingual', device=device)

def predict(texts: Union[str, List[str]]) -> Dict[str, float]:
    return detoxify.predict(texts)