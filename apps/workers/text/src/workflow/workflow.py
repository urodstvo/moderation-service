from dataclasses import dataclass
from datetime import timedelta
from typing import List
from temporalio import workflow
from temporalio.exceptions import FailureError
import asyncio

import src.activity as activities
from src.signal import UPDATE_STATUS_SIGNAL_NAME, CREATE_STATUS_SIGNAL_NAME
from src.signal.signal import send_create_node, send_update_node

@dataclass
class Item:
    id: int
    filename: str
    text: str   

@workflow.defn
class Workflow:
    @workflow.signal
    async def create_node(self, user_id: int, workflow_id: int, parent_node_id: int, details: dict):
        await send_create_node(
            self.parent_workflow_id,
            user_id,
            workflow_id,
            parent_node_id,
            details,
            CREATE_STATUS_SIGNAL_NAME,
        )

    @workflow.signal
    async def update_node(self, node_id: int, status: str, details: dict):
        await send_update_node(
            self.parent_workflow_id,
            node_id,
            status,
            details,
            UPDATE_STATUS_SIGNAL_NAME,
        )

    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item], blacklist: List[str], settings: List[dict]) -> List[dict]:
        try:
            items_with_filename = [item for item in items if item.filename]
            data_from_storage = await workflow.execute_activity(
                activities.get_texts_from_minio,
                items_with_filename,
                start_to_close_timeout=workflow.Duration(seconds=60)
            )

            storage_data_map = {data['filename']: data for data in data_from_storage}
            items_with_data = []
            for item in items:
                if item.filename and item.filename in storage_data_map:
                    storage_data = storage_data_map[item.filename]
                    items_with_data.append({
                        'id': item.id,
                        'text': storage_data['text'],
                    })
                else:
                    items_with_data.append(item)

            texts_predictions_task = workflow.execute_activity(
                activities.classify_texts,
                items_with_data,
                start_to_close_timeout=timedelta(seconds=60)
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
                workflow_id,
                items,
                texts_predictions,
                words_predictions,
                start_to_close_timeout=timedelta(seconds=30)
            )

            return processed_result

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
