import { useEffect, useRef } from "react";

import api from "../services/api";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import ChessBoard from "../components/ChessBoard";

import {
    PracticeProvider,
    usePractice,
} from "../context/PracticeContext";

function PracticeScreen() {

    const {

        // Current puzzle
        puzzle,
        setPuzzle,

        // Session statistics
        setCorrect,
        setWrong,

        // Puzzle state
        setCurrentMoveIndex,

        // UI state
        setHintLevel,
        setSolutionVisible,

        // Active filters
        selectedTheme,
        minRating,
        maxRating,

        // Theme list
        setAvailableThemes,

        loading,
        setLoading,

    } = usePractice();

    // ==========================================================
    // Load the list of themes from the backend.
    // This only runs once when the Practice page is opened.
    // ==========================================================

    async function loadThemes() {

        try {

            const response =
                await api.get("/api/puzzles/themes");

            setAvailableThemes(response.data);

        }

        catch (err) {

            console.error(
                "Theme Load Error",
                err
            );

        }

    }

    // ==========================================================
    // Request a new puzzle from the backend based on the
    // selected theme and rating range.
    // ==========================================================
    const requestId = useRef(0);

    async function loadPuzzle() {

        const currentRequest = ++requestId.current;

        setLoading(true);

        try {

            const response = await api.get(
                "/api/puzzles/random",
                {
                    params: {
                        theme: selectedTheme,
                        minRating,
                        maxRating,
                    },
                }
            );

            // Ignore stale responses
            if (currentRequest !== requestId.current)
                return;

            if (response.data.error) {

                setPuzzle(null);
                return;

            }

            setPuzzle(response.data);

            setCurrentMoveIndex(0);

            setHintLevel(0);

            setSolutionVisible(false);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            // Only the latest request is allowed to clear loading
            if (currentRequest === requestId.current) {
                setLoading(false);
            }

        }

    }

    // ==========================================================
    // Effects
    // ==========================================================

    // Load all available themes once.

    useEffect(() => {

        loadThemes();

    }, []);

    // Load a new puzzle whenever the filters change.

    useEffect(() => {

        loadPuzzle();

    }, [

        selectedTheme,

        minRating,

        maxRating,

    ]);

    // ==========================================================
    // Event Handlers
    // ==========================================================

    // Called when the user successfully solves a puzzle.

    function solved() {
        console.log("SOLVED callback reached");
        setCorrect(c => c + 1);

        loadPuzzle();

    }

    // Called whenever the user makes an incorrect move.

    function failed() {

        setWrong(w => w + 1);

    }


    // ==========================================================
    // Main Layout
    // ==========================================================

    return (

        <Layout

            sidebar={

                <Sidebar />

            }

            board={

                <ChessBoard

                    onCorrectMove={solved}

                    onWrongMove={failed}

                />

            }

            panel={

                <RightPanel

                    nextPuzzle={loadPuzzle}

                />

            }

        />

    );

}

export default function Practice() {

    return (

        <PracticeProvider>

            <PracticeScreen />

        </PracticeProvider>

    );

}