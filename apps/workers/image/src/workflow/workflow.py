from dataclasses import dataclass
from datetime import timedelta
from typing import List
from temporalio import workflow
from temporalio.common import RetryPolicy 
from temporalio.exceptions import FailureError

import src.activity as activities

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str

@dataclass
class Item:
    id: int
    original_filename: str
    filename: str

@workflow.defn(name="image_workflow")
class Workflow:
    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item]) -> List[ResultItem]:
        try:
            image_results = await activities.get_images_from_minio(items)

            ocr_inputs = [
                activities.OCRInput(
                    id=result.id,
                    original_filename=result.original_filename,
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
                retry_policy=RetryPolicy(maximum_attempts=3),
            )

            processed_result = await workflow.execute_activity(
                activities.assemble_result,  
                ocr_results,
                start_to_close_timeout=timedelta(minutes=1),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )

            return processed_result

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
