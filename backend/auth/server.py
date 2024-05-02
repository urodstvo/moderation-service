import uvicorn
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware


from src.config import redis
from src.db.base import init_db
from src.handlers.api import api_router
from src.handlers.auth import auth_router
from src.handlers.email import email_router
from src.handlers.password import password_router
from src.handlers.profile import profile_router
from src.handlers.admin import admin_router
from src.util import JWTBearer

app = FastAPI(title="SERVICE", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    password_router,
    prefix="/password",
    tags=["Password"],
)

app.include_router(
    email_router,
    dependencies=[Depends(JWTBearer())],
    prefix="/email",
    tags=["Email"],
)

app.include_router(
    profile_router,
    dependencies=[Depends(JWTBearer())],
    prefix="/profile",
    tags=["Profile"],
)

app.include_router(
    api_router,
    tags=["API"],
)

app.include_router(
    admin_router,
    dependencies=[Depends(JWTBearer())],
    tags=["ADMIN"],
    prefix="/admin",
)


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.on_event("shutdown")
async def on_shutdown():
    redis.close()


@app.get("/")
async def ping():
    return "hello world"


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000)
