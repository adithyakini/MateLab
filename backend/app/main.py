from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.puzzle_service import get_random_valid_puzzle

app = FastAPI(title="Chess Puzzle Generator API")

# Allow React frontend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Backend Connected Successfully 🚀"
    }


@app.get("/api/puzzles/random")
def random_puzzle():
    return get_random_valid_puzzle()


@app.get("/health")
def health():
    return {
        "status": "OK"
    }