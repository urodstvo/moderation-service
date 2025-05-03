import asyncio
# from dotenv import load_dotenv
from src.listeners import start_listener
from src.nats import natsClient
from src.db import database

async def main():
    # load_dotenv(".env", override=True)
    await natsClient.connect()

    while not natsClient.is_connected():
        await asyncio.sleep(0.1)    

    await start_listener() 
    try:
        while True:
            await asyncio.sleep(3600)
    except KeyboardInterrupt:
        print("Завершаем работу...")

    await natsClient.disconnect()
    database.close_connection()


if __name__ == "__main__":
    asyncio.run(main())

