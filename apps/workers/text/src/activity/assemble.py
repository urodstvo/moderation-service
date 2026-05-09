from dataclasses import dataclass
from temporalio import activity
from typing import List, Optional
from .retrieve import DeletedWord, TextRetrievingResult
from .classify import ClassificationResult, Classification as ItemClassification

@dataclass
class TextResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    classification: ItemClassification
    words: List[DeletedWord]
    nsfw_classification: Optional["NsfwClassification"] = None

@dataclass
class NsfwClassification:
    score: float
    is_nsfw: bool
    model: str

@dataclass
class Item:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    nsfw_classification: Optional[NsfwClassification] = None

@activity.defn
def assemble_result(
    workflow_id: int,
    items: List[Item],
    classifications: ClassificationResult,
    words: TextRetrievingResult
) -> List[TextResultItem]:
    result_items: List[TextResultItem] = []

    for item in items:
        cls = classifications.get(item.id, ItemClassification(
            toxicity=0.0,
            severe_toxicity=0.0,
            obscene=0.0,
            threat=0.0,
            insult=0.0,
            identity_attack=0.0,
        ))
        deleted_words = words.get(item.id).deleted_words if item.id in words and words[item.id] is not None else []
        result_items.append(TextResultItem(
            id=item.id,
            original_filename=item.original_filename,
            filename=item.filename,
            recognized_text=item.recognized_text,
            classification=cls,
            words=deleted_words,
            nsfw_classification=item.nsfw_classification,
        ))

    return result_items
