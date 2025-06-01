import asyncio
from nats.aio.client import Client
from nats.aio.errors import ErrConnectionClosed, ErrTimeout, ErrNoServers

from src.logger import logger
from src.config import NATS_URL


class NatsClient:
    def __init__(self):
        self.nc = Client()
        self.js = None
        self.connected = False

    async def connect(self):
        try:
            await self.nc.connect(servers=[NATS_URL])
            self.js = self.nc.jetstream()
            try:
                await self.js.add_stream(name="TASK_STREAM", subjects=["task"])
                logger.info("Stream 'TASK_STREAM' создан.")
            except Exception:
                pass

            self.connected = True
            logger.info(f"Успешно подключено к NATS: {NATS_URL}")
        except (ErrConnectionClosed, ErrTimeout, ErrNoServers) as e:
            logger.error(f"Ошибка подключения к NATS: {e}")
            self.connected = False

    async def disconnect(self):
        if self.nc.is_connected:
            await self.nc.close()
            self.connected = False
            logger.info("Отключено от NATS.")

    async def publish_message(self, subject: str, message: str):
        if not self.connected:
            logger.error("Нельзя публиковать — нет соединения с NATS.")
            return
        if self.js is None:
            logger.error("JetStream не инициализирован — вызовите connect() заново.")
            return
        try:
            await self.js.publish(subject, message.encode())
            logger.info(f"Опубликовано в '{subject}': {message}")
        except Exception as e:
            logger.error(f"Ошибка публикации: {e}")

    async def subscribe_to_subject(self, subject: str, callback, queue: str = None):
        if not self.connected:
            logger.error("Нельзя подписаться — нет соединения с NATS.")
            return
        try:
            await self.nc.subscribe(subject, queue=queue, cb=callback)
            kind = f"очередь '{queue}'" if queue else "канал"
            logger.info(f"Подписка на {kind} '{subject}' установлена.")
        except Exception as e:
            logger.error(f"Ошибка подписки на '{subject}': {e}")

    async def js_subscribe(self, subject: str, durable: str, callback, pull: bool = False):
        if not self.connected or self.js is None:
            logger.error("Нельзя JetStream‑подписать — нет соединения или js не инициализирован.")
            return None 

        try:
            if pull:
                sub = await self.js.pull_subscribe(subject, durable=durable)
                logger.info(f"JetStream pull '{durable}' на '{subject}' готова.")
                return sub
            else:
                await self.js.subscribe(
                    subject=subject,
                    durable=durable,
                    cb=lambda msg: asyncio.create_task(self._js_wrap_cb(msg, callback))
                )
                logger.info(f"JetStream push '{durable}' на '{subject}' установлена.")
                return None
        except Exception as e:
            logger.error(f"Ошибка JetStream‑подписки на '{subject}': {e}")
            return None

    async def _js_wrap_cb(self, msg, user_cb):
        try:
            await user_cb(msg)
        except Exception as e:
            logger.error(f"Ошибка обработки JetStream‑сообщения: {e}")

    async def unsubscribe(self, subscription):
        try:
            await subscription.unsubscribe()
            logger.info("Отписка выполнена.")
        except Exception as e:
            logger.error(f"Ошибка отписки: {e}")

    def is_connected(self):
        return self.connected
    
natsClient = NatsClient()