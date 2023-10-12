import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.router import auth_router, email_router, mod_router, v1_api_router, api_router

app = FastAPI(title="MODERATION SERVICE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "127.0.0.1", "0.0.0.0"],
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
    email_router,
    prefix="/email",
    tags=["Email"],
)

app.include_router(
    mod_router,
    prefix="/moderation",
    tags=["Moderation"],
)

app.include_router(
    api_router,
    prefix="/api",
    tags=["API"],
)

api = FastAPI(title="API")

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(
    v1_api_router,
    prefix="",
    tags=["Moderation"]
)

app.mount("/api/v1/", api)

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000)

