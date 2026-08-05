import { useEffect } from "react";

import api from "../services/api";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import ChessBoard from "../components/ChessBoard";

import {
    PracticeProvider,
    usePractice
} from "../context/PracticeContext";

function PracticeScreen() {

    const {

        puzzle,
        setPuzzle,

        correct,
        setCorrect,

        wrong,
        setWrong,

        accuracy,

        setHintLevel,
        setSolutionVisible,

        selectedTheme,

        minRating,

        maxRating,

    } = usePractice();

    async function loadPuzzle() {

        const response = await api.get(
            "/api/puzzles/random",
            {
                params:{
                    theme:selectedTheme,
                    minRating,
                    maxRating,
                }
            }
        );

        setPuzzle(response.data);

        // Reset puzzle-specific state
        setHintLevel(0);
        setSolutionVisible(false);

    }

    useEffect(() => {

        loadPuzzle();

    }, []);

    function solved() {

        setCorrect(c => c + 1);

        loadPuzzle();

    }

    function failed() {

        setWrong(w => w + 1);

    }

    if (!puzzle)
        return <h2 style={{ color: "white" }}>Loading...</h2>;

    return (

        <Layout

            sidebar={<Sidebar />}

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