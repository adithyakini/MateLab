from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/check",
    tags=["Check"]
)

class MoveRequest(BaseModel):
    solution: str
    played: str

@router.post("/")
def check_move(move: MoveRequest):
    return {
        "correct": move.solution == move.played
    }