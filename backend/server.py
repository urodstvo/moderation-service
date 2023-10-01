import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.auth.router import auth_router


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

if __name__ == "__main__":
    uvicorn.run("server:app", reload=True)

