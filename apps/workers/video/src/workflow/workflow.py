from dataclasses import dataclass
from datetime import timedelta
from typing import List
from temporalio import workflow
from temporalio.exceptions import FailureError

import src.activity as activities
from src.signal import UPDATE_STATUS_SIGNAL_NAME, CREATE_STATUS_SIGNAL_NAME
from src.signal.signal import send_create_node, send_update_node

@dataclass
class Item:
    id: int
    filename: str

@dataclass
class ResultItem:
    id: int
    filename: str
    recognized_text: str
    content_type: str

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
            minio_results = await workflow.execute_activity(
                activities.get_files_from_minio,
                items,
                start_to_close_timeout=timedelta(minutes=1),
            )

            audios = await workflow.execute_activity(
                activities.extract_audio_from_video,
                minio_results,
                start_to_close_timeout=timedelta(minutes=1),
            )
            
            transcription_inputs = [
                activities.TranscriptionInput(
                    id=result.id,
                    filename=result.filename,
                    audio_bytes=result.audio_bytes
                )
                for result in audios
                if not result.error
            ]
            
            transcription_results = await workflow.execute_activity(
                activities.transcribe,
                transcription_inputs,
                start_to_close_timeout=timedelta(minutes=5),
            )
            
            final_results = await workflow.execute_activity(
                activities.assemble_result,
                transcription_results,
                start_to_close_timeout=timedelta(minutes=1),
            )
            
            return final_results

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
