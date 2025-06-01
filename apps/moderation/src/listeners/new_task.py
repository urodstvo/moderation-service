import json
import os
from typing import Awaitable
from urllib.parse import urlparse
from nats.aio.client import Msg
from src.logger import logger
from src.db import database
from src.processors import AudioProcessor, TextProcessor, VideoProcessor, ImageProcessor
from src.nats import natsClient

PROCESSORS = {
    "audio": AudioProcessor,
    "image": ImageProcessor,
    "text": TextProcessor,
    "video": VideoProcessor,
}

async def handle_task_event(msg: Msg) -> None:
    try:
        # 1) Распарсить payload
        raw = msg.data.decode() if isinstance(msg.data, bytes) else msg.data
        payload = json.loads(raw)
        logger.info(f"Получено сообщение: {payload}")

        # 2) Проверить taskId
        task_id = payload.get("taskId")
        if not task_id:
            raise ValueError("taskId не найден в сообщении")

        # 3) Получить из БД
        query = "SELECT id, file_path, content_type FROM tasks WHERE id = %s"
        result = database.fetch_query(query, (task_id,))
        if not result:
            raise LookupError(f"Задача с taskId={task_id} не найдена")

        _, filepath, content_type = result[0]
        filepath = (
            os.path.basename(urlparse(filepath).path)
            if filepath.startswith("http")
            else filepath
        )

        # 4) Обновить статус в БД: в процессе
        database.execute_query("UPDATE tasks SET status = %s WHERE id = %s", ('processed', task_id))

        # 5) Обработать файл
        processor_cls = PROCESSORS.get(content_type)
        if not processor_cls:
            raise ValueError(f"Неизвестный content_type: {content_type}")

        processor = processor_cls(filepath)
        if isinstance(processor, TextProcessor):
            text_processor = processor
        else:
            extracted = processor.process()
            if isinstance(processor, ImageProcessor):
                extracted = extracted["text"]
            if isinstance(extracted, list):
                extracted = " ".join(extracted)
            text_processor = TextProcessor.from_text(extracted)

        # 6) Декстоксификация
        detoxify_result = text_processor.process()

        # 7) Сохранить результат и завершить
        database.execute_query(
            "INSERT INTO task_results (task_id, content) VALUES (%s, %s)",
            (task_id, json.dumps(detoxify_result))
        )
        database.execute_query(
            "UPDATE tasks SET status = %s WHERE id = %s",
            ('completed', task_id)
        )

        # 8) Отправить event.done
        event_payload = json.dumps({"taskId": task_id}, ensure_ascii=False)
        await natsClient.publish_message("event.done", event_payload)
        logger.info(f"Событие event.done отправлено для task_id={task_id}")

        # 9) Подтвердить JetStream, что сообщение обработано
        await msg.ack()

    except Exception as e:
        logger.error(f"Ошибка обработки task_id={locals().get('task_id')}: {e}")
        try:
            # Обновить статус задачи на error
            if 'task_id' in locals():
                database.execute_query(
                    "UPDATE tasks SET status = %s WHERE id = %s",
                    ('error', locals()['task_id'])
                )
            # Сообщаем JetStream, что не смогли обработать
            # nak() → переотправка, term() → больше не пытаться
            await msg.nak()  # или msg.term(), если вы не хотите повторов
        except Exception as sec_e:
            logger.error(f"Ошибка в error-handler-е: {sec_e}")
       



