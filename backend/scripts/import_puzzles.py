import os
import sqlite3
import pandas as pd
import zstandard as zstd
from io import TextIOWrapper

# -------------------------
# Configuration
# -------------------------

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DB_FOLDER = os.path.join(BASE_DIR, "database")
DB_FILE = os.path.join(DB_FOLDER, "chess.db")

DATA_FILE = os.path.join(
    BASE_DIR,
    "data",
    "lichess_db_puzzle.csv.zst"
)

os.makedirs(DB_FOLDER, exist_ok=True)

# -------------------------
# Database
# -------------------------

conn = sqlite3.connect(DB_FILE)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS puzzles(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    puzzle_id TEXT,

    fen TEXT,

    moves TEXT,

    rating INTEGER,

    themes TEXT

)
""")

conn.commit()

print("Database ready.")

# -------------------------
# Read compressed csv
# -------------------------

dctx = zstd.ZstdDecompressor()

with open(DATA_FILE, "rb") as fh:

    stream = dctx.stream_reader(fh)

    reader = pd.read_csv(
        TextIOWrapper(stream, encoding="utf-8"),
        chunksize=50000
    )

    total = 0

    for chunk in reader:

        mate = chunk[
            chunk["Themes"].str.contains("mateIn1", na=False)
        ]

        rows = []

        for _, row in mate.iterrows():

            rows.append(

                (
                    row["PuzzleId"],
                    row["FEN"],
                    row["Moves"],
                    int(row["Rating"]),
                    row["Themes"]
                )

            )

        cursor.executemany(
            """
            INSERT INTO puzzles
            (
                puzzle_id,
                fen,
                moves,
                rating,
                themes
            )
            VALUES (?,?,?,?,?)
            """,
            rows
        )

        conn.commit()

        total += len(rows)

        print(f"Imported {total:,} mate-in-1 puzzles")

conn.close()

print()

print("Finished!")
print(DB_FILE)