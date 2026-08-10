import chess

from sqlalchemy import text

from .database import engine


def get_random_valid_puzzle(
    theme="mateIn1",
    min_rating=800,
    max_rating=1200,
):

    query = text("""
        SELECT
            puzzle_id,
            fen,
            moves,
            rating,
            themes
        FROM puzzles
        WHERE themes LIKE :theme
          AND rating BETWEEN :min_rating AND :max_rating
        ORDER BY RANDOM()
        LIMIT 1
    """)

    with engine.connect() as conn:

        row = conn.execute(
            query,
            {
                "theme": f"%{theme}%",
                "min_rating": min_rating,
                "max_rating": max_rating,
            },
        ).mappings().first()

    if row is None:

        return {
            "error": "No puzzles found"
        }

    moves = row["moves"].split()

    board = chess.Board(row["fen"])

    # Play the first (given) move automatically
    board.push(
        chess.Move.from_uci(moves[0])
    )

    print("=" * 60)
    print("Puzzle:", row["puzzle_id"])
    print("Original FEN:", row["fen"])
    print("Moves:", moves)
    print("Returned FEN:", board.fen())
    print("Expected move:", moves[1])

    expected = chess.Move.from_uci(moves[1])

    print(
        "Expected move legal?",
        expected in board.legal_moves
    )

    print("=" * 60)

    return {

        "puzzle_id": row["puzzle_id"],

        "fen": board.fen(),

        "rating": row["rating"],

        "themes": row["themes"],

        "solution": moves[1],

        "line": moves[1:],

    }