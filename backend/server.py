from fastapi import FastAPI
from src.auth.router import auth_router


app = FastAPI(title="MODERATION SERVICE")

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)
