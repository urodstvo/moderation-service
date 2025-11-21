import asyncio
from src.utils import CONFIG, logger
from temporalio.client import Client
from temporalio.worker import Worker, UnsandboxedWorkflowRunner

from src.workflow import Workflow
import src.activity as activities


async def main():
    client = await Client.connect(CONFIG.TemporalClientUrl, namespace="default")
    task_queue = "image_workflow_queue"
    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[Workflow],
        activities=[
            activities.process_ocr,
            activities.assemble_result,
        ],
        workflow_runner=UnsandboxedWorkflowRunner(),
    )

    logger.info("Image Worker is starting...")
    await worker.run()    
    logger.info("Worker stopped gracefully")


if __name__ == "__main__":
    asyncio.run(main())
