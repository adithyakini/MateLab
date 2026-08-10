from sqlalchemy import text

from app.database import engine


def main():

    with engine.begin() as conn:

        conn.execute(
            text("""
                CREATE TABLE IF NOT EXISTS puzzles (

                    id BIGSERIAL PRIMARY KEY,

                    puzzle_id TEXT NOT NULL,

                    fen TEXT NOT NULL,

                    moves TEXT NOT NULL,

                    rating INTEGER NOT NULL,

                    themes TEXT NOT NULL

                )
            """)
        )

        print("Puzzles table created.")

        conn.execute(
            text("""
                CREATE INDEX IF NOT EXISTS idx_puzzles_rating
                ON puzzles(rating)
            """)
        )

        conn.execute(
            text("""
                CREATE INDEX IF NOT EXISTS idx_puzzles_themes
                ON puzzles(themes)
            """)
        )

        conn.execute(
            text("""
                CREATE INDEX IF NOT EXISTS idx_puzzles_rating_themes
                ON puzzles(rating, themes)
            """)
        )

        conn.execute(
            text("""
                CREATE INDEX IF NOT EXISTS idx_puzzles_puzzle_id
                ON puzzles(puzzle_id)
            """)
        )

        print("Indexes created.")


if __name__ == "__main__":
    main()