import { createContext, useContext, useState } from "react";

const PracticeContext = createContext();

export function PracticeProvider({ children }) {

    const [puzzle, setPuzzle] = useState(null);

    const [correct, setCorrect] = useState(0);

    const [wrong, setWrong] = useState(0);

    const [streak, setStreak] = useState(0);

    const [hintLevel, setHintLevel] = useState(0);

    const [solutionVisible, setSolutionVisible] = useState(false);

    const [selectedTheme, setSelectedTheme] = useState("mateIn1");

    const [minRating, setMinRating] = useState(800);

    const [maxRating, setMaxRating] = useState(1200);

    const accuracy =
        correct + wrong === 0
            ? 100
            : Math.round(correct * 100 / (correct + wrong));

    return (

        <PracticeContext.Provider
            value={{

                puzzle,
                setPuzzle,

                correct,
                setCorrect,

                wrong,
                setWrong,

                streak,
                setStreak,

                accuracy,

                hintLevel,
                setHintLevel,

                solutionVisible,
                setSolutionVisible,

                selectedTheme,
                setSelectedTheme,

                minRating,
                setMinRating,

                maxRating,
                setMaxRating,

            }}
        >

            {children}

        </PracticeContext.Provider>

    );

}

export function usePractice(){

    return useContext(PracticeContext);

}