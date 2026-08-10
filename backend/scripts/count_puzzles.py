import csv
import io
import zstandard as zstd


SOURCE = r"C:\Users\adith\OneDrive\Documents\BAckup\chess-puzzle-generator\backend\data\lichess_db_puzzle.csv.zst"


def main():

    print("Counting puzzles...")
    print(SOURCE)

    dctx = zstd.ZstdDecompressor()

    total = 0

    with open(SOURCE, "rb") as fh:

        with dctx.stream_reader(fh) as stream:

            text_stream = io.TextIOWrapper(
                stream,
                encoding="utf-8",
            )

            reader = csv.DictReader(text_stream)

            for _ in reader:

                total += 1

                if total % 100000 == 0:
                    print(f"{total:,} puzzles...")

    print()
    print("=" * 40)
    print(f"TOTAL PUZZLES: {total:,}")
    print("=" * 40)


if __name__ == "__main__":
    main()