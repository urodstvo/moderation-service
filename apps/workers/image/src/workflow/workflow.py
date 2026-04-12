from dataclasses import dataclass
from datetime import timedelta
from typing import List, Optional
from temporalio import workflow
from temporalio.common import RetryPolicy 
from temporalio.exceptions import FailureError

import src.activity as activities
from src.models import NsfwClassification

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str
    nsfw_classification: Optional[NsfwClassification] = None

@dataclass
class Item:
    id: int
    original_filename: str
    filename: str

@workflow.defn(name="image_workflow")
class Workflow:
    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item], nsfw_model_name: str) -> List[ResultItem]:
        try:
            ocr_results = await workflow.execute_activity(
                activities.process_images,
                args=[items, nsfw_model_name],
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
