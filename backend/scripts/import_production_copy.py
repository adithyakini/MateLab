import csv
import io
import os
import random
import tempfile
import time

import zstandard as zstd
from sqlalchemy import text

from app.database import engine


SOURCE = (
    r"C:\Users\adith\OneDrive\Documents\BAckup"
    r"\chess-puzzle-generator\backend\data"
    r"\lichess_db_puzzle.csv.zst"
)

TARGET_ROWS = 1_000_000
RANDOM_SEED = 20260810


def select_to_csv(output_file):

    rng = random.Random(RANDOM_SEED)
    reservoir = []
    total = 0

    print("=" * 60)
    print("PHASE 1: SELECTING 1,000,000 PUZZLES")
    print("=" * 60)

    dctx = zstd.ZstdDecompressor()

    with open(SOURCE, "rb") as fh:
        with dctx.stream_reader(fh) as stream:

            text_stream = io.TextIOWrapper(
                stream,
                encoding="utf-8"
            )

            reader = csv.DictReader(text_stream)

            for row in reader:

                total += 1

                if len(reservoir) < TARGET_ROWS:
                    reservoir.append(row)
                else:
                    position = rng.randint(0, total - 1)

                    if position < TARGET_ROWS:
                        reservoir[position] = row

                if total % 500_000 == 0:
                    print(f"Processed {total:,} source puzzles...")

    print(f"Source puzzles : {total:,}")
    print(f"Selected       : {len(reservoir):,}")

    print()
    print("Writing temporary CSV...")

    writer = csv.writer(
        output_file,
        quoting=csv.QUOTE_MINIMAL,
        lineterminator="\n"
    )

    for number, row in enumerate(reservoir, start=1):

        writer.writerow([
            row["PuzzleId"],
            row["FEN"],
            row["Moves"],
            row["Rating"],
            row["Themes"],
        ])

        if number % 100_000 == 0:
            print(f"Prepared {number:,} / {TARGET_ROWS:,}")

    output_file.flush()

    return total


def copy_to_postgres(csv_path):

    print()
    print("=" * 60)
    print("PHASE 2: COPYING INTO NEON")
    print("=" * 60)

    start = time.time()

    # Get the raw psycopg2 connection underneath SQLAlchemy.
    raw_connection = engine.raw_connection()

    try:

        cursor = raw_connection.cursor()

        print("Clearing existing data...")

        cursor.execute(
            "TRUNCATE TABLE puzzles RESTART IDENTITY"
        )

        raw_connection.commit()

        print("Starting PostgreSQL COPY...")

        with open(
            csv_path,
            "r",
            encoding="utf-8",
            newline=""
        ) as csv_file:

            cursor.copy_expert(
                """
                COPY puzzles
                (
                    puzzle_id,
                    fen,
                    moves,
                    rating,
                    themes
                )
                FROM STDIN
                WITH
                (
                    FORMAT CSV
                )
                """,
                csv_file
            )

        raw_connection.commit()

        elapsed = time.time() - start

        print()
        print(
            f"COPY completed in {elapsed:.1f} seconds."
        )

    except Exception:

        raw_connection.rollback()
        raise

    finally:

        raw_connection.close()


def report():

    print()
    print("=" * 60)
    print("PHASE 3: VERIFYING DATABASE")
    print("=" * 60)

    with engine.connect() as conn:

        count = conn.execute(
            text(
                "SELECT COUNT(*) FROM puzzles"
            )
        ).scalar_one()

        table_size = conn.execute(
            text(
                """
                SELECT pg_size_pretty(
                    pg_relation_size('puzzles')
                )
                """
            )
        ).scalar_one()

        index_size = conn.execute(
            text(
                """
                SELECT pg_size_pretty(
                    pg_indexes_size('puzzles')
                )
                """
            )
        ).scalar_one()

        total_size = conn.execute(
            text(
                """
                SELECT pg_size_pretty(
                    pg_total_relation_size('puzzles')
                )
                """
            )
        ).scalar_one()

    print(f"Rows    : {count:,}")
    print(f"Table   : {table_size}")
    print(f"Indexes : {index_size}")
    print(f"Total   : {total_size}")

    print("=" * 60)


def main():

    start = time.time()

    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        newline="",
        suffix=".csv",
        delete=False
    ) as temp:

        csv_path = temp.name

        try:

            select_to_csv(temp)

            print()
            print(f"Temporary CSV: {csv_path}")

        finally:

            temp.close()

    try:

        copy_to_postgres(csv_path)
        report()

    finally:

        print()
        print("Removing temporary CSV...")

        try:
            os.remove(csv_path)
        except OSError:
            pass

    print()
    print(
        f"Total elapsed time: "
        f"{time.time() - start:.1f} seconds"
    )


if __name__ == "__main__":
    main()