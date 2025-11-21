from dataclasses import dataclass
from typing import List, Dict, Any, Tuple
from temporalio import activity
from src.models import rubertconv

@dataclass
class TextInput:
    id: int
    text: str

@dataclass
class DeletedWord:
    word: str
    score: float
    start: int
    end: int
    label: str

@dataclass
class TextDeletionResult:
    deleted_words: List[DeletedWord]
    total_deleted: int

TextRetrievingResult = Dict[int, TextDeletionResult]

def merge_adjacent_ranges(predictions: List[Dict[str, Any]], original_text: str) -> List[Dict[str, Any]]:
    if not predictions:
        return []
    
    sorted_predictions = sorted(predictions, key=lambda x: x['start'])
    merged = []
    
    i = 0
    while i < len(sorted_predictions):
        current = sorted_predictions[i].copy()
        j = i + 1
        
        while j < len(sorted_predictions):
            next_pred = sorted_predictions[j]
            
            is_adjacent = (current['end'] == next_pred['start'])
            is_same_word = (not original_text[current['end']:next_pred['start']].strip())
            
            if is_adjacent and is_same_word:
                current['word'] += next_pred['word']
                current['end'] = next_pred['end']
                current['score'] = max(current['score'], next_pred['score'])
                j += 1
            else:
                break
        
        merged.append(current)
        i = j
    
    return merged

@activity.defn
async def retrieve_words(texts: List[TextInput]) -> TextRetrievingResult:
    results = {}
    
    for text_input in texts:
        try:
            predictions = rubertconv.predict(text_input.text)
            delete_predictions = [p for p in predictions if p.get('label') == 'delete']
            merged_predictions = merge_adjacent_ranges(delete_predictions, text_input.text)
            
            deleted_words = []
            for prediction in merged_predictions:
                deleted_words.append(DeletedWord(
                    word=prediction['word'],
                    score=float(prediction['score']),
                    start=prediction['start'],
                    end=prediction['end'],
                    label=prediction['label']
                ))
            
            results[text_input.id] = TextDeletionResult(
                deleted_words=deleted_words,
                total_deleted=len(deleted_words)
            )
            
        except Exception as e:
            activity.logger.warning(f"Failed to process text ID {text_input.id}: {e}")
            results[text_input.id] = TextDeletionResult(
                deleted_words=[],
                total_deleted=0
            )

    return results