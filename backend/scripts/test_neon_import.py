import csv
import io
import zstandard as zstd

from sqlalchemy import text

from app.database import engine


SOURCE = r"C:\Users\adith\OneDrive\Documents\BAckup\chess-puzzle-generator\backend\data\lichess_db_puzzle.csv.zst"

TEST_ROWS = 10_000


def main():

    print("Opening Lichess dataset...")
    print(SOURCE)

    # Start with an empty table.
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE TABLE puzzles RESTART IDENTITY"))

    dctx = zstd.ZstdDecompressor()

    rows = []

    with open(SOURCE, "rb") as fh:

        with dctx.stream_reader(fh) as stream:

            text_stream = io.TextIOWrapper(
                stream,
                encoding="utf-8",
            )

            reader = csv.DictReader(text_stream)

            for row in reader:

                rows.append(
                    {
                        "puzzle_id": row["PuzzleId"],
                        "fen": row["FEN"],
                        "moves": row["Moves"],
                        "rating": int(row["Rating"]),
                        "themes": row["Themes"],
                    }
                )

                if len(rows) >= TEST_ROWS:
                    break

    print(f"Read {len(rows):,} puzzles.")

    with engine.begin() as conn:

        conn.execute(
            text("""
                INSERT INTO puzzles
                (
                    puzzle_id,
                    fen,
                    moves,
                    rating,
                    themes
                )
                VALUES
                (
                    :puzzle_id,
                    :fen,
                    :moves,
                    :rating,
                    :themes
                )
            """),
            rows,
        )

    print("Inserted test data.")

    with engine.connect() as conn:

        count = conn.execute(
            text("SELECT COUNT(*) FROM puzzles")
        ).scalar_one()

        size = conn.execute(
            text("""
                SELECT
                    pg_size_pretty(
                        pg_total_relation_size('puzzles')
                    )
            """)
        ).scalar_one()

        table_size = conn.execute(
            text("""
                SELECT
                    pg_size_pretty(
                        pg_relation_size('puzzles')
                    )
            """)
        ).scalar_one()

        index_size = conn.execute(
            text("""
                SELECT
                    pg_size_pretty(
                        pg_indexes_size('puzzles')
                    )
            """)
        ).scalar_one()

    print()
    print("======================================")
    print("NEON TEST IMPORT")
    print("======================================")
    print(f"Rows       : {count:,}")
    print(f"Table      : {table_size}")
    print(f"Indexes    : {index_size}")
    print(f"Total      : {size}")
    print("======================================")


if __name__ == "__main__":
    main()