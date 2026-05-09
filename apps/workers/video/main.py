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
    executor = ThreadPoolExecutor(max_workers=CONFIG.VideoActivityMaxConcurrency)

    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[Workflow],
        activities=[
            activities.extract_audio_from_video,
            activities.extract_keyframes,
            activities.nsfw_batch_check,
            activities.aggregate_moderation_result,
            activities.refine_segments,
            activities.upload_frames_to_minio,
        ],
        workflow_runner=UnsandboxedWorkflowRunner(),
        activity_executor=executor,
    )

    logger.info("Worker is starting...")
    await worker.run()    
    logger.info("Stopped gracefully")

if __name__ == "__main__":
    asyncio.run(main())
