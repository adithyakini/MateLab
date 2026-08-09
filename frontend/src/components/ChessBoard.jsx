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

    // ==========================================================
    // Practice Context
    // ==========================================================

    const {

        puzzle,

        hintLevel,

        solutionVisible,
        setSolutionVisible,

        currentMoveIndex,
        setCurrentMoveIndex,

        loading,

    } = usePractice();

    // ==========================================================
    // Board State
    // ==========================================================

    const [game, setGame] = useState(null);

    // Overlay shown after correct / wrong answers

    const [overlayMessage, setOverlayMessage] =
        useState("");

    const [overlayColor, setOverlayColor] =
        useState("");

    // Green / Red glow around board

    const [boardFlash, setBoardFlash] =
        useState("");

    // Prevent dragging while animations run

    const [dragEnabled, setDragEnabled] =
        useState(true);
    
    // ==========================================================
    // Load a new puzzle
    // ==========================================================

    useEffect(() => {

        if (!puzzle) return;

        try {

            const chess = new Chess(puzzle.fen);

            setGame(chess);

            setOverlayMessage("");
            setOverlayColor("");
            setBoardFlash("");

            setDragEnabled(true);

        }

        catch (err) {

            console.error(
                "Invalid FEN",
                err
            );

        }

    }, [puzzle]);

    // ==========================================================
    // Timer
    // ==========================================================
    useEffect(()=>{

        //setSeconds(0);

        const timer=setInterval(()=>{

            //setSeconds(s=>s+1);

        },1000);

        return ()=>clearInterval(timer);

    },[puzzle]);
    // ==========================================================
    // Show Solution
    // ==========================================================

    useEffect(() => {

        if (!solutionVisible) return;

        if (!game) return;

        let cancelled = false;

        async function playSolution() {

            const chess =
                new Chess(game.fen());

            setDragEnabled(false);

            for (

                let i = currentMoveIndex;

                i < puzzle.line.length;

                i++

            ) {

                if (cancelled) return;

                await new Promise(resolve =>
                    setTimeout(resolve, 700)
                );

                playUciMove(
                    chess,
                    puzzle.line[i]
                );

                setGame(
                    new Chess(chess.fen())
                );

            }

            setOverlayMessage("✓ Solution");

            setOverlayColor("#16a34a");

            setTimeout(() => {

                setOverlayMessage("");

                setSolutionVisible(false);

                onCorrectMove?.();

            }, 1000);

        }

        playSolution();

        return () => {

            cancelled = true;

        };

    }, [

        solutionVisible,

        game,

        currentMoveIndex,

        puzzle,

    ]);

    // ==========================================================
    // Loading Screen
    // ==========================================================

    if (loading) {

        return (

            <div className="board-wrapper">

                <h2
                    style={{
                        color: "white",
                    }}
                >

                    ♞ Loading Puzzle...

                </h2>

            </div>

        );

    }

    if (!game || !puzzle) {

        return null;

    }

    // ==========================================================
    // Helper Functions
    // ==========================================================

    // Executes a move written in UCI notation.
    // Example:
    //
    // e2e4
    // g7g8q

    function playUciMove(chess, uci) {

        chess.move({

            from: uci.slice(0, 2),

            to: uci.slice(2, 4),

            promotion:
                uci.length === 5
                    ? uci[4]
                    : undefined,

        });

    }

    function showSuccess(message) {

        setOverlayMessage(message);

        setOverlayColor("#16a34a");

        setBoardFlash(
            "0 0 60px rgba(34,197,94,.9)"
        );

    }

    function showFailure(message) {

        setOverlayMessage(message);

        setOverlayColor("#dc2626");

        setBoardFlash(
            "0 0 60px rgba(239,68,68,.9)"
        );

    }

    const successMessages = [

        "✓ Brilliant!",

        "✓ Excellent!",

        "✓ Great Find!",

        "✓ Beautiful!",

        "✓ Nice Tactic!",

    ];

    const failureMessages = [

        "Keep Looking",

        "Not Quite",

        "Try Again",

        "Look Deeper",

        "There's a Better Move",

    ];

    function randomMessage(list) {

        return list[
            Math.floor(
                Math.random() *
                list.length
            )
        ];

    }

    // ==========================================================
    // Puzzle Logic
    // ==========================================================
function onDrop(sourceSquare, targetSquare) {

    const chess = new Chess(game.fen());

    let move;

    try {

        move = chess.move({

            from: sourceSquare,

            to: targetSquare,

            promotion: "q",

        });

    }

    catch {

        return false;

    }

    // Convert the move into UCI notation.
    // Example: e2e4
    const playedMove =
        move.from +
        move.to +
        (move.promotion ?? "");

    // Current move expected from the user.
    const expectedMove =
        puzzle.line[currentMoveIndex];

    // ----------------------------------------------------------
    // Correct Move
    // ----------------------------------------------------------

    if (playedMove === expectedMove) {

        setGame(chess);

        const nextIndex =
            currentMoveIndex + 1;

        // ------------------------------------------------------
        // Puzzle Finished
        // ------------------------------------------------------

        if (nextIndex >= puzzle.line.length) {

            setDragEnabled(false);

            showSuccess(
                randomMessage(successMessages)
            );

            setTimeout(() => {

                setOverlayMessage("");

                setBoardFlash("");

                setDragEnabled(true);

                setCurrentMoveIndex(0);

                onCorrectMove?.();

            }, 900);

            return true;

        }

        // ------------------------------------------------------
        // Engine Reply
        // ------------------------------------------------------

        setDragEnabled(false);

        setTimeout(() => {

            const engineMove =
                puzzle.line[nextIndex];

            playUciMove(
                chess,
                engineMove
            );

            setGame(
                new Chess(chess.fen())
            );

            setCurrentMoveIndex(
                nextIndex + 1
            );

            setDragEnabled(true);

        }, 400);

        return true;

    }

    // ----------------------------------------------------------
    // Wrong Move
    // ----------------------------------------------------------

    setDragEnabled(false);

    showFailure(
        randomMessage(failureMessages)
    );

    setTimeout(() => {

        setOverlayMessage("");

        setBoardFlash("");

        setDragEnabled(true);

    }, 700);

    onWrongMove?.();

    return false;

}

// ==========================================================
// Hint Squares
// ==========================================================

const squareStyles = {};

const currentMove =
    puzzle.line?.[currentMoveIndex];

if (currentMove && hintLevel >= 1) {

    squareStyles[
        currentMove.substring(0, 2)
    ] = {

        background:
            "radial-gradient(circle, rgba(34,197,94,.75) 0%, rgba(34,197,94,.25) 70%)",

    };

}

if (currentMove && hintLevel >= 2) {

    squareStyles[
        currentMove.substring(2, 4)
    ] = {

        background:
            "radial-gradient(circle, rgba(59,130,246,.75) 0%, rgba(59,130,246,.25) 70%)",

    };

}

// ==========================================================
// Render
// ==========================================================

return (

    <div className="board-wrapper">

        <div
            className={`board-container ${

                dragEnabled
                    ? ""
                    : "disabled"

            }`}

            style={{

                boxShadow: boardFlash,

            }}

        >

            <Chessboard
                id="MateLabBoard"

                position={game.fen()}

                boardOrientation="white"

                areCoordinatesVisible={true}

                animationDuration={0}

                customDarkSquareStyle={{
                    backgroundColor: "#769656",
                }}

                customLightSquareStyle={{
                    backgroundColor: "#EEEED2",
                }}

                customBoardStyle={{
                    borderRadius: "10px",
                    boxShadow: boardFlash,
                }}

                customSquareStyles={squareStyles}

                arePiecesDraggable={dragEnabled}

                onPieceDrop={onDrop}
            />

            <BoardOverlay

                message={overlayMessage}

                color={overlayColor}

            />

        </div>

    </div>

);

}