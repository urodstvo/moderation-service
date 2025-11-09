import asyncio
from src.utils import CONFIG, logger

from temporalio.client import Client
from temporalio.worker import Worker, UnsandboxedWorkflowRunner

from src.workflow import Workflow
import src.activity as activities


async def main():
    client = await Client.connect(CONFIG.TemporalClientUrl, namespace="default")
    task_queue = "audio_workflow_queue"
    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[Workflow],
        activities=[
            activities.get_files_from_minio,
            activities.transcribe,
            activities.assemble_result,
        ],
        workflow_runner=UnsandboxedWorkflowRunner(),
    )

    logger.info("Worker is starting...")
    await worker.run()    
    logger.info("Stopped gracefully")

if __name__ == "__main__":
    asyncio.run(main())
