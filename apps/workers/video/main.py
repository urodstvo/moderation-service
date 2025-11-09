import asyncio
from src.utils import CONFIG, logger
from temporalio.client import Client
from temporalio.worker import Worker, UnsandboxedWorkflowRunner
from concurrent.futures import ThreadPoolExecutor

from src.workflow import Workflow
import src.activity as activities


async def main():
    client = await Client.connect(CONFIG.TemporalClientUrl, namespace="default")
    task_queue = "video_workflow_queue"
    executor = ThreadPoolExecutor(max_workers=10)

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
        workflow_runner=UnsandboxedWorkflowRunner(),
        activity_executor=executor,
    )

    logger.info("Worker is starting...")
    await worker.run()    
    logger.info("Stopped gracefully")

if __name__ == "__main__":
    asyncio.run(main())
