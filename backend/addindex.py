import sqlite3

conn = sqlite3.connect("database/chess.db")

cursor = conn.cursor()

print("Creating indexes...")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_rating
ON puzzles(rating)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_theme_rating
ON puzzles(themes, rating)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_puzzle_id
ON puzzles(puzzle_id)
""")

conn.commit()

conn.close()

print("Done.")