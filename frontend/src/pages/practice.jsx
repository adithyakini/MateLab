import { useEffect } from "react";

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
        //UI
        loading,
        setLoading,

        // Active filters
        selectedTheme,
        minRating,
        maxRating,

        // Theme list
        setAvailableThemes,

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

    async function loadPuzzle() {

        // Prevent multiple requests if one is already running
        if (loading) return;

        try {

            setLoading(true);

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

            // Backend couldn't find a matching puzzle
            if (response.data.error) {

                console.error(response.data.error);

                setPuzzle(null);

                return;

            }

            // Store the newly loaded puzzle
            setPuzzle(response.data);

            // Restart the puzzle engine
            setCurrentMoveIndex(0);

            // Reset UI state
            setHintLevel(0);
            setSolutionVisible(false);

        }

        catch (err) {

            console.error(
                "Puzzle Load Error",
                err
            );

        }

        finally {

            // Always remove the loading state
            setLoading(false);

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

        setCorrect(c => c + 1);

        loadPuzzle();

    }

    // Called whenever the user makes an incorrect move.

    function failed() {

        setWrong(w => w + 1);

    }

    // ==========================================================
    // Initial Loading Screen
    // ==========================================================

    if (!puzzle && loading) {

        return (

            <div
                style={{

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    height: "100vh",

                    color: "white",

                    fontSize: "28px",

                    fontWeight: 600,

                }}
            >

                ♞ Finding your next puzzle...

            </div>

        );

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