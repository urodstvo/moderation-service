from dataclasses import dataclass
from typing import List
from .retrieve import DeletedWord, TextRetrievingResult
from .classify import ClassificationResult, Classification as ItemClassification

@dataclass
class TextResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    content_type: str
    classification: ItemClassification
    words: List[DeletedWord]

@dataclass
class Item:
    id: int
    filename: str
    text: str  

def assemble_result(
    workflow_id: int,
    items: List[Item],
    classifications: ClassificationResult,
    words: TextRetrievingResult
) -> List[TextResultItem]:
    result_items: List[TextResultItem] = []

    for item in items:
        cls = classifications[item.id]
        deleted_words = words[item.id].deleted_words if item.id in words and words[item.id] is not None else []
        result_items.append(TextResultItem(
            id=item.id,
            original_filename=item.filename,
            filename=item.filename,
            recognized_text=item.text,
            content_type='text',
            classification=cls,
            words=deleted_words,
        ))

    return result_items
