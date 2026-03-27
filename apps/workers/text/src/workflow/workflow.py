import asyncio
from dataclasses import dataclass
from datetime import timedelta
import datetime
from typing import List
from temporalio import workflow
from temporalio.exceptions import FailureError
from temporalio.common import RetryPolicy

import src.activity as activities

@dataclass
class Item:
    id: int
    original_filename: str
    filename: str
    recognized_text: str   

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    classification: activities.Classification
    words: List[activities.DeletedWord]

@dataclass
class Settings:
    user_id: int
    toxicity_classification_model_name: str

@workflow.defn(name="text_workflow")
class Workflow:    
    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item], blacklist: List[str], settings: Settings) -> ResultItem:
        try:
            items_with_filename = [item for item in items if not item.recognized_text and item.filename]
            data_from_storage = await activities.get_texts_from_minio(items_with_filename)

            storage_text_map = {
                data.filename: data.recognized_text
                for data in data_from_storage
                if data.recognized_text and not data.error
            }

            for item in items:
                if item.recognized_text:
                    continue
                if not item.filename:
                    continue
                if item.filename in storage_text_map:
                    item.recognized_text = storage_text_map[item.filename]

            items_with_data = [
                {'id': item.id, 'text': item.recognized_text}
                for item in items
                if item.recognized_text
            ]

            texts_predictions_task = workflow.execute_activity(
                activities.classify_texts,
                args=[
                    items_with_data,
                    settings.toxicity_classification_model_name,
                ],
                start_to_close_timeout=timedelta(seconds=60),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )

            words_predictions_task = workflow.execute_activity(
                activities.retrieve_words,
                items_with_data,
                start_to_close_timeout=timedelta(seconds=60)
            )

            texts_predictions, words_predictions = await asyncio.gather(
                texts_predictions_task,
                words_predictions_task
            )

            processed_result = await workflow.execute_activity(
                activities.assemble_result,
                args=[
                    workflow_id,
                    items,
                    texts_predictions,
                    words_predictions
                ],
                start_to_close_timeout=timedelta(seconds=30),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )

            return processed_result

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
