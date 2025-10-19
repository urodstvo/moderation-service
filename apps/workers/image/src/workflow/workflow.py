from dataclasses import dataclass
from datetime import timedelta
from typing import List
from temporalio import workflow
from temporalio.exceptions import FailureError

import src.activity as activities
from src.signal import UPDATE_STATUS_SIGNAL_NAME, CREATE_STATUS_SIGNAL_NAME
from src.signal.signal import send_create_node, send_update_node

@dataclass
class ResultItem:
    id: int
    filename: str
    recognized_text: str
    content_type: str

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
    async def run(self, workflow_id: int, user_id: int, items: List[Item]) -> List[ResultItem]:
        try:
            image_results  = await workflow.execute_activity(
                activities.get_images_from_minio,
                items,
                start_to_close_timeout=timedelta(seconds=60)
            )

            ocr_inputs = [
                activities.OCRInput(
                    id=result.id,
                    filename=result.filename,
                    image_bytes=result.image_bytes
                )
                for result in image_results
                if not result.error and result.image_bytes
            ]

            ocr_results = await workflow.execute_activity(
                activities.process_ocr,
                ocr_inputs,
                start_to_close_timeout=timedelta(minutes=10),
            )

            processed_result = await workflow.execute_activity(
                activities.assemble_result,  
                ocr_results,
                start_to_close_timeout=timedelta(minutes=1),
            )

            return processed_result

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
