import { createContext, useContext, useState } from "react";
const PracticeContext = createContext();

export function PracticeProvider({ children }) {

    // ==========================================================
    // Current Puzzle
    // ==========================================================

    // Puzzle currently being solved
    const [puzzle, setPuzzle] = useState(null);

    // Position within the solution line.
    // Example:
    // line = [user, engine, user, engine]
    // currentMoveIndex points to the next move expected from the user.
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

    // ==========================================================
    // Practice Session Statistics
    // ==========================================================

    // Number of correctly solved puzzles
    const [correct, setCorrect] = useState(0);

    // Number of failed attempts
    const [wrong, setWrong] = useState(0);

    // Session accuracy (%)
    const accuracy =
        correct + wrong === 0
            ? 100
            : Math.round(
                  (correct * 100) /
                  (correct + wrong)
              );

    // ==========================================================
    // Puzzle Assistance
    // ==========================================================

    // Hint level:
    // 0 = none
    // 1 = highlight source square
    // 2 = highlight destination square
    const [hintLevel, setHintLevel] = useState(0);

    // When true, automatically plays the remaining solution.
    const [solutionVisible, setSolutionVisible] = useState(false);

    // ==========================================================
    // Puzzle Filters
    // ==========================================================

    // Currently selected tactical theme
    const [selectedTheme, setSelectedTheme] =
        useState("mateIn1");

    // Themes available in the database
    const [availableThemes, setAvailableThemes] =
        useState([]);

    // Difficulty preset selected by the user
    const [difficulty, setDifficulty] =
        useState("Novice");

    // Rating ranges for each difficulty
    const difficultyMap = {

        Beginner: [0, 800],

        Novice: [800, 1200],

        Intermediate: [1200, 1600],

        Advanced: [1600, 2000],

        Expert: [2000, 3000],

    };

    // Active rating filter
    const [minRating, setMinRating] =
        useState(difficultyMap.Novice[0]);

    const [maxRating, setMaxRating] =
        useState(difficultyMap.Novice[1]);

    // ==========================================================
    // UI State
    // ==========================================================

    // True while waiting for the backend to return a puzzle.
    const [loading, setLoading] = useState(false);
    // Time taken to solve the current puzzle (seconds)
    //const [seconds, setSeconds] = useState(0);
    const [bestTime, setBestTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);

    const [timerRunning, setTimerRunning] = useState(false);

    const [startTime, setStartTime] = useState(null);

    return (

        <PracticeContext.Provider
            value={{

                // Puzzle
                puzzle,
                setPuzzle,

                currentMoveIndex,
                setCurrentMoveIndex,

                // Session
                correct,
                setCorrect,

                wrong,
                setWrong,


                accuracy,

                // Assistance
                hintLevel,
                setHintLevel,

                solutionVisible,
                setSolutionVisible,

                // Filters
                selectedTheme,
                setSelectedTheme,

                availableThemes,
                setAvailableThemes,

                difficulty,
                setDifficulty,

                difficultyMap,

                minRating,
                setMinRating,

                maxRating,
                setMaxRating,

                // UI
                loading,
                setLoading,

                bestTime,
                setBestTime,

                elapsed,
                setElapsed,

                timerRunning,
                setTimerRunning,

                startTime,
                setStartTime,

            }}
        >

            {children}

        </PracticeContext.Provider>

    );

}

export function usePractice() {

    return useContext(PracticeContext);

}