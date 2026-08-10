import csv
import io
from collections import Counter

import zstandard as zstd


SOURCE = r"C:\Users\adith\OneDrive\Documents\BAckup\chess-puzzle-generator\backend\data\lichess_db_puzzle.csv.zst"


def main():

    print("Analyzing full Lichess puzzle database...")
    print(SOURCE)
    print()

    rating_buckets = Counter()
    theme_counts = Counter()
    theme_combo_counts = Counter()

    total = 0

    dctx = zstd.ZstdDecompressor()

    with open(SOURCE, "rb") as fh:

        with dctx.stream_reader(fh) as stream:

            text_stream = io.TextIOWrapper(
                stream,
                encoding="utf-8",
            )

            reader = csv.DictReader(text_stream)

            for row in reader:

                total += 1

                # -----------------------------
                # Rating bucket
                # -----------------------------

                rating = int(row["Rating"])

                if rating < 800:
                    bucket = "<800"
                elif rating < 1000:
                    bucket = "800-999"
                elif rating < 1200:
                    bucket = "1000-1199"
                elif rating < 1400:
                    bucket = "1200-1399"
                elif rating < 1600:
                    bucket = "1400-1599"
                elif rating < 1800:
                    bucket = "1600-1799"
                elif rating < 2000:
                    bucket = "1800-1999"
                elif rating < 2200:
                    bucket = "2000-2199"
                elif rating < 2400:
                    bucket = "2200-2399"
                else:
                    bucket = "2400+"

                rating_buckets[bucket] += 1

                # -----------------------------
                # Themes
                # -----------------------------

                themes = row["Themes"].split()

                for theme in themes:
                    theme_counts[theme] += 1

                # Count exact theme combinations too
                theme_combo = " ".join(sorted(themes))
                theme_combo_counts[theme_combo] += 1

                # -----------------------------
                # Progress
                # -----------------------------

                if total % 500_000 == 0:
                    print(f"Processed {total:,} puzzles...")

    print()
    print("=" * 70)
    print("TOTAL")
    print("=" * 70)
    print(f"Total puzzles: {total:,}")

    print()
    print("=" * 70)
    print("RATING DISTRIBUTION")
    print("=" * 70)

    for bucket, count in rating_buckets.items():

        percentage = count / total * 100

        print(
            f"{bucket:12} "
            f"{count:10,} "
            f"({percentage:6.2f}%)"
        )

    print()
    print("=" * 70)
    print("THEME DISTRIBUTION")
    print("=" * 70)

    for theme, count in theme_counts.most_common():

        percentage = count / total * 100

        print(
            f"{theme:30} "
            f"{count:10,} "
            f"({percentage:6.2f}%)"
        )

    print()
    print("=" * 70)
    print("UNIQUE THEMES")
    print("=" * 70)

    print(f"Unique themes: {len(theme_counts):,}")

    print()
    print("=" * 70)
    print("MOST COMMON EXACT THEME COMBINATIONS")
    print("=" * 70)

    for combo, count in theme_combo_counts.most_common(30):

        percentage = count / total * 100

        print(
            f"{count:10,} "
            f"({percentage:6.2f}%) "
            f"{combo}"
        )

    print()
    print("Analysis complete.")


if __name__ == "__main__":
    main()