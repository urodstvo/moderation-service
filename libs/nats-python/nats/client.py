import asyncio
import json
import logging
from typing import Callable, TypeVar, Awaitable

from config import Config

import nats
from nats.js.api import StreamConfig, ConsumerConfig, AckPolicy, DeliverPolicy
from nats.aio.client import Client
from nats.js.client import JetStreamContext

Req = TypeVar("Req")
ConsumeSubscribeCallback = Callable[[asyncio.AbstractEventLoop, Req], Awaitable[None]]


class JetstreamClient:
    def __init__(self, subject: str, stream_name: str, timeout: float, config: Config, logger: logging.Logger):
        self.subject = subject
        self.stream_name = stream_name
        self.timeout = timeout
        self.config = config
        self.logger = logger

        self.nc: Client | None = None
        self.js: JetStreamContext | None = None
        self.subscription = None
        self.connected = False

    @classmethod
    async def new(cls, subject: str, stream_name: str, timeout: float, config: Config, logger: logging.Logger):
        self = cls(subject, stream_name, timeout, config, logger)

        try:
            self.nc = await nats.connect(servers=[config.NatsUrl])
            self.js = self.nc.jetstream()
            self.connected = True

            try:
                await self.js.stream_info(stream_name)
            except Exception as e:
                self.logger.warning(f"Stream '{stream_name}' not found, creating new one: {e}")
                await self.js.add_stream(StreamConfig(name=stream_name, subjects=[subject]))

        except (nats.errors.TimeoutError, nats.errors.NoServersError, nats.errors.ConnectionClosedError) as e:
            self.logger.error(f"Occurred error while connecting to Nats: {e}")
            self.connected = False

        return self

    async def publish(self, msg: Req):
        if not self.connected or not self.js:
            self.logger.error("Publish unavailable: no connection to NATS.")
            return
        try:
            payload = json.dumps(msg).encode("utf-8")
            await self.js.publish(self.subject, payload)
        except Exception as e:
            self.logger.error(f"Publish unavailable: {e}")

    async def consume(self, durable: str, callback: ConsumeSubscribeCallback[Req]):
        if not self.connected or not self.js:
            self.logger.error("Consume anavailable: no connection to Nats.")
            return

        try:
            await self.js.add_consumer(
                stream=self.stream_name,
                config=ConsumerConfig(
                    durable_name=durable,
                    ack_policy=AckPolicy.EXPLICIT,
                    deliver_policy=DeliverPolicy.ALL,
                )
            )
        except Exception as e:
            self.logger.error(f"Occured error while creating a consumer: {e}")
            return

        async def message_handler(msg):
            try:
                data = json.loads(msg.data.decode())
                await asyncio.wait_for(callback(asyncio.get_event_loop(), data), timeout=self.timeout)
                await msg.ack()
            except Exception as e:
                self.logger.warning(f"Occurred error while executing callback: {e}")
                await msg.nak()

        try:
            self.subscription = await self.js.subscribe(
                subject=self.subject,
                durable=durable,
                cb=message_handler
            )
        except Exception as e:
            self.logger.error(f"Occurred error while consuming: {e}")

    async def unsubscribe(self):
        if self.subscription:
            try:
                await self.subscription.unsubscribe()
            except Exception as e:
                self.logger.warning(f"Occurred error while unsubscribing: {e}")

    async def disconnect(self):
        if self.connected and self.nc:
            try:
                await self.nc.close()
            except Exception as e:
                self.logger.warning(f"Occurred error while disconnecting: {e}")
            self.connected = False
