import sqlite3

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DB_PATH = BASE_DIR / "database" / "chess.db"


def get_random_valid_puzzle():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    row = conn.execute("""
        SELECT *
        FROM puzzles
        ORDER BY RANDOM()
        LIMIT 1
    """).fetchone()

    conn.close()

    solution = row["moves"].split()[0]

    return {
        "puzzle_id": row["puzzle_id"],
        "fen": row["fen"],
        "rating": row["rating"],
        "themes": row["themes"],
        "solution": solution,
    }