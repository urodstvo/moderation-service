from datetime import timedelta

from fastapi import HTTPException

from src.config import redis


def addRequestCount(host: str) -> None:
    key = "text_request_count_" + host
    count = redis.get(key)
    if count is None:
        redis.set(key, int(count) + 1, ex=timedelta(days=1))
        return

    if int(count) + 1 > 50:
        raise HTTPException(
            status_code=423,
            detail="Rate limit"
        )

    redis.set(key, int(count) + 1)



async def get_requests_count(username: str) -> int:
    return 0
