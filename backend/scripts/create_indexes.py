import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "chess.db"

conn = sqlite3.connect(DB_PATH)

cursor = conn.cursor()

print("Creating indexes...")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_rating
ON puzzles(rating)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_themes
ON puzzles(themes)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_rating_themes
ON puzzles(rating, themes)
""")

conn.commit()

conn.close()

print("Done.")