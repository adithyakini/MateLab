import { useEffect, useState } from "react";
import api from "../services/api";
import ChessBoard from "../components/ChessBoard";

export default function Practice() {
  const [puzzle, setPuzzle] = useState(null);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  async function loadPuzzle() {
    const response = await api.get("/api/puzzles/random");

    console.log(response.data);

    setPuzzle(response.data);
  }

  useEffect(() => {
    loadPuzzle();
  }, []);

  function puzzleSolved() {
    setCorrect((prev) => prev + 1);
    loadPuzzle();
  }

  function puzzleFailed() {
    setWrong((prev) => prev + 1);
  }

  if (!puzzle) {
    return <h2>Loading...</h2>;
  }

  const accuracy =
    correct + wrong === 0
      ? 100
      : Math.round((correct * 100) / (correct + wrong));

  return (
    <div
      style={{
        display: "flex",
        gap: 50,
        padding: 30,
        alignItems: "flex-start",
      }}
    >
      <ChessBoard
        puzzle={puzzle}
        onCorrectMove={puzzleSolved}
        onWrongMove={puzzleFailed}
      />

      <div style={{ width: 320 }}>
        <h1>🎯 Mate in One Trainer</h1>

        <h2>
          {puzzle.fen.includes(" w ")
            ? "⚪ White to Move"
            : "⚫ Black to Move"}
        </h2>

        <h3>Find the Checkmate</h3>

        <hr />

        <p>
          <strong>⭐ Rating</strong>
          <br />
          {puzzle.rating}
        </p>

        <p>
          <strong>📚 Theme</strong>
          <br />
          {puzzle.themes}
        </p>

        <hr />

        <h3>Statistics</h3>

        <p>✅ Solved : {correct}</p>

        <p>❌ Wrong : {wrong}</p>

        <p>🎯 Accuracy : {accuracy}%</p>

        <hr />

        <button onClick={loadPuzzle}>
          Skip Puzzle
        </button>
      </div>
    </div>
  );
}