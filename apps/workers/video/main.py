import asyncio
from src.utils import CONFIG
from temporalio.client import Client
from temporalio.worker import Worker

from src.workflow import Workflow
import src.activity as activities


async def main():
    client = await Client.connect(CONFIG.TemporalClientUrl, namespace="default")
    task_queue = "video_workflow_queue"
    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[Workflow],
        activities=[
            activities.get_files_from_minio,
            activities.extract_audio_from_video,
            activities.transcribe,
            activities.assemble_result,
        ],
    )

    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
