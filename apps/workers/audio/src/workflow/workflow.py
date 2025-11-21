from dataclasses import dataclass
from datetime import timedelta
import datetime
from typing import Any, Dict, List, Optional
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

@dataclass
class ResultItem:
    id: int
    original_filename: str
    filename: str
    recognized_text: str

@workflow.defn(name="audio_workflow")
class Workflow:
    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item]) -> List[ResultItem]:
        try:
            minio_results = await activities.get_files_from_minio(items)
            
            transcription_inputs = [
                activities.TranscriptionInput(
                    id=result.id,
                    original_filename=result.original_filename,
                    filename=result.filename,
                    audio_bytes=result.audio_bytes
                )
                for result in minio_results
                if not result.error
            ]
            
            transcription_results = await workflow.execute_activity(
                activities.transcribe,
                transcription_inputs,
                start_to_close_timeout=timedelta(minutes=5),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )
            
            final_results = await workflow.execute_activity(
                activities.assemble_result,
                transcription_results,
                start_to_close_timeout=timedelta(minutes=1),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )
            
            return final_results

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
