from dataclasses import dataclass
from datetime import timedelta
from typing import List
from temporalio import workflow
from temporalio.exceptions import FailureError

import src.activity as activities

@dataclass
class Item:
    id: int
    filename: str
    original_filename: str

@workflow.defn(name="video_workflow")
class Workflow:
    @workflow.run
    async def run(self, workflow_id: int, user_id: int, items: List[Item]) -> List[Item]:
        try:
            audios = await workflow.execute_activity(
                activities.extract_audio_from_video,
                items,
                start_to_close_timeout=timedelta(minutes=1),
            )       

            results = []
            for audio in audios:
                if not audio.error :
                    results.append(Item(
                        id=audio.id,
                        filename=audio.filename,
                        original_filename=audio.original_filename
                    ))

            
            return results

        except FailureError as e:
            workflow.logger.error(f"[MainWorkflow] Failed: {e}")
            raise
