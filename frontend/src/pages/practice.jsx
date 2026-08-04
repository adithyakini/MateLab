import { useEffect, useState } from "react";

import api from "../services/api";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import ChessBoard from "../components/ChessBoard";

export default function Practice() {

    const [puzzle, setPuzzle] = useState(null);

    const [correct, setCorrect] = useState(0);

    const [wrong, setWrong] = useState(0);

    async function loadPuzzle() {

        const response = await api.get("/api/puzzles/random");

        setPuzzle(response.data);

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
        return <h2 style={{color:"white"}}>Loading...</h2>;

    const accuracy =
        correct + wrong === 0
            ? 100
            : Math.round(correct * 100 / (correct + wrong));

    return (

        <Layout

            sidebar={<Sidebar />}

            board={

                <ChessBoard

                    puzzle={puzzle}

                    onCorrectMove={solved}

                    onWrongMove={failed}

                />

            }

            panel={

                <RightPanel

                    puzzle={puzzle}

                    correct={correct}

                    wrong={wrong}

                    accuracy={accuracy}

                    nextPuzzle={loadPuzzle}

                />

            }

        />

    );

}