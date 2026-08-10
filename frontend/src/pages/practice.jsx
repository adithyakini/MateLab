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

        elapsed,
        setElapsed,

        startTime,
        setStartTime,

        timerRunning,
        setTimerRunning,

        bestTime,
        setBestTime,

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

            setElapsed(0);

            setStartTime(performance.now());

            setTimerRunning(true);
            //console.log("TIMER STARTED");
            //console.log("startTime =", performance.now());

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
    //----------------------------
    //Timer
    //----------------------------
    useEffect(() => {

        if (!timerRunning) return;

        let interval;

        interval = setInterval(() => {

            setElapsed(

                (performance.now() - startTime) / 1000

            );

        }, 100);

        return () => clearInterval(interval);

    }, [

        timerRunning,

        startTime,

    ]);
    // ==========================================================
    // Event Handlers
    // ==========================================================

    // Called when the user successfully solves a puzzle.

    function solved() {
        //console.log("elapsed =", elapsed);
        //console.log("bestTime =", bestTime);
        setTimerRunning(false);

        setBestTime(previous => {

            if (previous === null)
                return elapsed;

            return Math.min(previous, elapsed);

        });
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