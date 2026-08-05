from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "chess.db"

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

AVAILABLE_THEMES = None
@app.get("/api/puzzles/themes")
def get_themes():

    global AVAILABLE_THEMES

    if AVAILABLE_THEMES is not None:
        return AVAILABLE_THEMES

    conn = sqlite3.connect(DB_PATH)

    rows = conn.execute("""
        SELECT themes
        FROM puzzles
    """).fetchall()

    conn.close()

    themes = set()

    for row in rows:

        if row[0]:
            themes.update(row[0].split())

    AVAILABLE_THEMES = sorted(themes)

    return AVAILABLE_THEMES

@app.get("/")
def home():
    return {
        "message": "Backend Connected Successfully 🚀"
    }


@app.get("/api/puzzles/random")
def random_puzzle(
    theme: str = "mateIn1",
    minRating: int = 800,
    maxRating: int = 1200,
):
    return get_random_valid_puzzle(
        theme,
        minRating,
        maxRating,
    )


@app.get("/health")
def health():
    return {
        "status": "OK"
    }