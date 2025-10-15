import asyncio
from src.utils import CONFIG
from temporalio.client import Client
from temporalio.worker import Worker

from src.workflow import Workflow
import src.activity as activities


async def main():
    client = await Client.connect(CONFIG.TemporalClientUrl, namespace="default")
    task_queue = "text_workflow_queue"
    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[Workflow],
        activities=[
            activities.classify_texts,
            activities.get_texts_from_minio,
            activities.assemble_result,
            activities.retrieve_words,
        ],
    )

    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
