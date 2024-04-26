import uvicorn
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware

from src.db.base import init_db
from src.handlers.auth import auth_router
from src.handlers.email import email_router
from src.handlers.password import password_router
from src.handlers.profile import profile_router
from src.util import JWTBearer

app = FastAPI(title="AUTH SERVICE", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
async def ping():
    return "hello world"


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000)
