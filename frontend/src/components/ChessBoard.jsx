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
    if (!puzzle) return;

    const chess = new Chess(puzzle.fen);
    setGame(chess);
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
    } catch {
      return false;
    }

    const playedMove =
      move.from +
      move.to +
      (move.promotion ?? "");

    console.log("Played :", playedMove);
    console.log("Expected:", puzzle.solution);

    if (playedMove === puzzle.solution) {
      setGame(chess);

      setTimeout(() => {
        onCorrectMove?.();
      }, 100);

      return true;
    }

    onWrongMove?.();
    return false;
  }

    console.log("Puzzle FEN =", JSON.stringify(puzzle.fen));
    console.log("Game FEN   =", JSON.stringify(game.fen()));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "min(100%, calc(100vh - 48px))",
          aspectRatio: "1 / 1",
          border: "4px solid yellow",
        }}
      >
        <Chessboard
            key={game.fen()}
            options={{
                position: game.fen(),

                boardStyle: {
                background: "red",
                },

                onPieceDrop: ({ sourceSquare, targetSquare }) =>
                onDrop(sourceSquare, targetSquare),
            }}
        />
      </div>
    </div>
  );
}