import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.router import auth_router, email_router, mod_router

app = FastAPI(title="MODERATION SERVICE")

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
    email_router,
    prefix="/email",
    tags=["Email"],
)

app.include_router(
    mod_router,
    prefix="/moderation",
    tags=["Moderation"],
)

if __name__ == "__main__":
    uvicorn.run("server:app", reload=True)

