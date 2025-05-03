from src.nats import natsClient
from .new_task import handle_task_event


async def start_listener():
    # await natsClient.subscribe_to_subject("task", handle_task_event, queue="moderation")
    await natsClient.js_subscribe("task", durable="DUR1", callback=handle_task_event)

__all__ = ["start_listener"]