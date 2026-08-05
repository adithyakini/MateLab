import sqlite3
import chess

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "chess.db"


def get_random_valid_puzzle(
    theme="mateIn1",
    min_rating=800,
    max_rating=1200,
):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    row = conn.execute(
        """
        SELECT *
        FROM puzzles
        WHERE themes LIKE ?
        AND rating BETWEEN ? AND ?
        ORDER BY RANDOM()
        LIMIT 1
        """,
        (
            f"%{theme}%",
            min_rating,
            max_rating,
        ),
    ).fetchone()
    
    if row is None:
        conn.close()
        return {
            "error": "No puzzles found"
        }
    conn.close()

    moves = row["moves"].split()

    board = chess.Board(row["fen"])

    # Play the first (given) move automatically
    board.push(chess.Move.from_uci(moves[0]))
    print("=" * 60)
    print("Puzzle:", row["puzzle_id"])
    print("Original FEN:", row["fen"])
    print("Moves:", moves)
    print("Returned FEN:", board.fen())
    print("Expected move:", moves[1])

    expected = chess.Move.from_uci(moves[1])
    print("Expected move legal?", expected in board.legal_moves)
    print("=" * 60)
    return {
        "puzzle_id": row["puzzle_id"],
        "fen": board.fen(),
        "rating": row["rating"],
        "themes": row["themes"],
        "solution": moves[1],
        "line": moves[1:],
    }