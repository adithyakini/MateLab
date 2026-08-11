import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine
from app.puzzle_service import get_random_valid_puzzle


app = FastAPI(title="Chess Puzzle Generator API")


# --------------------------------------------------
# CORS
# --------------------------------------------------

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

origins = [
    "http://localhost:5173",
    frontend_url,
]

# Remove duplicates
origins = list(set(origins))


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Themes
# --------------------------------------------------

AVAILABLE_THEMES = None


@app.get("/api/puzzles/themes")
def get_themes():

    global AVAILABLE_THEMES

    if AVAILABLE_THEMES is not None:
        return AVAILABLE_THEMES

    with engine.connect() as conn:

        rows = conn.execute(
            text(
                """
                SELECT DISTINCT theme
                FROM (
                    SELECT unnest(
                        string_to_array(themes, ' ')
                    ) AS theme
                    FROM puzzles
                    WHERE themes IS NOT NULL
                    AND themes <> ''
                ) AS theme_list
                WHERE theme <> ''
                ORDER BY theme
                """
            )
        ).fetchall()

    AVAILABLE_THEMES = [
        row[0]
        for row in rows
    ]

    return AVAILABLE_THEMES


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "MateLab API Connected Successfully 🚀"
    }


# --------------------------------------------------
# Random Puzzle
# --------------------------------------------------

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


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "OK"
    }