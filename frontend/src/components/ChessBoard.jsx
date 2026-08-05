import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

import { usePractice } from "../context/PracticeContext";

import BoardOverlay from "./BoardOverlay";

import "./ChessBoard.css";

export default function ChessBoard({
    onCorrectMove,
    onWrongMove,
}) {

    const {
        puzzle,
        hintLevel,
        solutionVisible,
        setSolutionVisible,
    } = usePractice();

    const [game, setGame] = useState(null);

    const [overlayMessage, setOverlayMessage] = useState("");
    const [overlayColor, setOverlayColor] = useState("");
    const [boardFlash, setBoardFlash] = useState("");
    const [dragEnabled, setDragEnabled] = useState(true);

    useEffect(() => {

        if (!puzzle) return;

        try {

            const chess = new Chess(puzzle.fen);

            setGame(chess);

            setOverlayMessage("");
            setBoardFlash("");
            setDragEnabled(true);

        } catch (err) {

            console.error("Invalid FEN", err);

        }

    }, [puzzle]);

    if (!puzzle || !game) {
        return null;
    }

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

        if (playedMove === puzzle.solution) {

            setGame(chess);

            setDragEnabled(false);

            setOverlayMessage("✓ Brilliant!");

            setOverlayColor("#16a34a");

            setBoardFlash("0 0 60px rgba(34,197,94,.9)");

            setTimeout(() => {

                setOverlayMessage("");
                setBoardFlash("");
                setDragEnabled(true);

                onCorrectMove?.();

            }, 800);

            return true;

        }

        setDragEnabled(false);

        setOverlayMessage("Keep Looking");

        setOverlayColor("#dc2626");

        setBoardFlash("0 0 60px rgba(239,68,68,.9)");

        setTimeout(() => {

            setOverlayMessage("");
            setBoardFlash("");
            setDragEnabled(true);

        }, 700);

        onWrongMove?.();

        return false;

    }
    const squareStyles = {};

    if (hintLevel >= 1) {

        const from = puzzle.solution.substring(0, 2);

        squareStyles[from] = {

            background:
                "radial-gradient(circle, rgba(34,197,94,.75) 0%, rgba(34,197,94,.25) 70%)"

        };

    }

    if (hintLevel >= 2) {

        const to = puzzle.solution.substring(2, 4);

        squareStyles[to] = {

            background:
                "radial-gradient(circle, rgba(59,130,246,.75) 0%, rgba(59,130,246,.25) 70%)"

        };

    }
    return (

        <div className="board-wrapper">

            <div
                className={`board-container ${
                    dragEnabled ? "" : "disabled"
                }`}
                style={{
                    boxShadow: boardFlash,
                }}
            >

                <Chessboard
                    options={{

                        position: game.fen(),

                        squareStyles,

                        allowDragging: dragEnabled,

                        onPieceDrop: ({
                            sourceSquare,
                            targetSquare,
                        }) =>
                            onDrop(
                                sourceSquare,
                                targetSquare
                            ),

                    }}
                />

                <BoardOverlay
                    message={overlayMessage}
                    color={overlayColor}
                />

            </div>

        </div>

    );

}