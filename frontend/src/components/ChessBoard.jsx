import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

export default function ChessBoard({
  puzzle,
  onCorrectMove,
  onWrongMove,
}) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (puzzle) {
      setGame(new Chess(puzzle.fen));
    }
  }, [puzzle]);

  if (!game) return null;

  function onDrop(sourceSquare, targetSquare) {
  const chess = new Chess(game.fen());

  let move;

  try {
    move = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  } catch (err) {
    return false;
  }

  setGame(chess);

  const playedMove =
    move.from +
    move.to +
    (move.promotion ?? "");

  console.log("Played :", playedMove);
  console.log("Solution:", puzzle.solution);

  if (playedMove === puzzle.solution) {
    setTimeout(() => {
      alert("✅ Correct!");
      onCorrectMove?.();
    }, 100);
  } else {
    setTimeout(() => {
      alert("❌ Wrong!");
      onWrongMove?.();
    }, 100);
  }

  return true;
}

  return (
    <div style={{ width: 550 }}>
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation:
            game.turn() === "w"
              ? "white"
              : "black",
          boardWidth: 550,
          onPieceDrop: onDrop,
        }}
      />
    </div>
  );
}