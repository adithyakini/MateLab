from fastapi import APIRouter
from backend.app.puzzle_service import get_random_puzzle

router = APIRouter(
    prefix="/api/puzzles",
    tags=["Puzzles"]
)


@router.get("/random")
def random_puzzle():
    return get_random_puzzle()