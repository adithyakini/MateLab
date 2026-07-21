from sqlalchemy import Column, Integer, String
from .database import Base

class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, index=True)
    puzzle_id = Column(String)
    fen = Column(String)
    moves = Column(String)
    rating = Column(Integer)
    themes = Column(String)