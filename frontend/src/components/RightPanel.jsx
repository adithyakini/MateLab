import "./RightPanel.css";
import { usePractice } from "../context/PracticeContext";
import { themeDictionary } from "../utils/themeDictionary";

export default function RightPanel({ nextPuzzle }) {

    const {

        // Current puzzle
        puzzle,

        // Session
        correct,
        wrong,
        accuracy,
        seconds,
        bestTime,

        // Assistance
        setHintLevel,
        setSolutionVisible,

        // Filters
        selectedTheme,
        setSelectedTheme,

        availableThemes,

        difficulty,
        setDifficulty,

        difficultyMap,

        setMinRating,
        setMaxRating,

    } = usePractice();

    if (!puzzle) return null;

    // ==========================================================
    // Helpers
    // ==========================================================

    function getDifficultyLabel(rating) {

        if (rating < 800) return "Beginner";
        if (rating < 1200) return "Novice";
        if (rating < 1600) return "Intermediate";
        if (rating < 2000) return "Advanced";

        return "Expert";

    }

    function sideToMove() {

        return puzzle.fen.split(" ")[1] === "w"
            ? "⚪ White to Move"
            : "⚫ Black to Move";

    }

    function prettyThemes() {

        return puzzle.themes
            .split(" ")
            .slice(0, 3);

    }

    function changeDifficulty(level) {

        setDifficulty(level);

        setMinRating(
            difficultyMap[level][0]
        );

        setMaxRating(
            difficultyMap[level][1]
        );

    }

    function formatTime(totalSeconds) {

        if (
            totalSeconds === null ||
            totalSeconds === undefined
        ) {

            return "--:--";

        }

        const mins =
            Math.floor(totalSeconds / 60);

        const secs =
            totalSeconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    }

    function getDifficultyBars(rating) {

        if (rating < 600) return 2;
        if (rating < 800) return 3;
        if (rating < 1000) return 4;
        if (rating < 1200) return 5;
        if (rating < 1400) return 6;
        if (rating < 1600) return 7;
        if (rating < 1800) return 8;
        if (rating < 2200) return 9;

        return 10;

    }

    // ==========================================================
    // Build grouped theme list
    // ==========================================================

    const groupedThemes = {};

    availableThemes.forEach(theme => {

        const info =
            themeDictionary[theme] ?? {

                label: theme,
                category: "Other",

            };

        if (!groupedThemes[info.category]) {

            groupedThemes[info.category] = [];

        }

        groupedThemes[info.category].push({

            key: theme,
            label: info.label,

        });

    });

    const categories =
        Object.keys(groupedThemes).sort();

    return (

        <div className="right-panel">

            <div className="panel-title">

                ♟ Practice

            </div>

            {/* ====================================================== */}
            {/* TRAINING SETUP                                        */}
            {/* ====================================================== */}

            <div className="panel-card">

                <div className="card-title">

                    Training Setup

                </div>

                <label>

                    Theme

                </label>

                <select

                    className="setup-select"

                    value={selectedTheme}

                    onChange={(e) =>
                        setSelectedTheme(
                            e.target.value
                        )
                    }

                >

                    {categories.map(category => (

                        <optgroup

                            key={category}

                            label={category}

                        >

                            {groupedThemes[category].map(theme => (

                                <option

                                    key={theme.key}

                                    value={theme.key}

                                >

                                    {theme.label}

                                </option>

                            ))}

                        </optgroup>

                    ))}

                </select>

                <label
                    style={{
                        marginTop: 16,
                        display: "block",
                    }}
                >

                    Difficulty

                </label>

                <select

                    className="setup-select"

                    value={difficulty}

                    onChange={(e) =>
                        changeDifficulty(
                            e.target.value
                        )
                    }

                >

                    {Object.keys(difficultyMap).map(level => (

                        <option

                            key={level}

                            value={level}

                        >

                            {level}

                        </option>

                    ))}

                </select>

            </div>

            {/* ====================================================== */}
            {/* CURRENT PUZZLE                                        */}
            {/* ====================================================== */}

            <div className="panel-card">

                <div className="card-title">

                    Current Puzzle

                </div>

                <div
                    style={{
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 700,
                        marginBottom: 24,
                    }}
                >

                    {sideToMove()}

                </div>

                <div className="difficulty-meter">

                    {Array.from({ length: 10 }).map((_, i) => (

                        <div

                            key={i}

                            className={
                                i < getDifficultyBars(puzzle.rating)
                                    ? `meter-fill meter-${i}`
                                    : "meter-empty"
                            }

                        />

                    ))}

                </div>

                <div
                    style={{
                        marginTop: 18,
                        textAlign: "center",
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#CBD5E1",
                    }}
                >

                    {getDifficultyLabel(
                        puzzle.rating
                    )}

                    {" • "}

                    {puzzle.rating} ELO

                </div>

                <hr
                    style={{
                        border: "none",
                        borderTop: "1px solid #374151",
                        margin: "22px 0 18px",
                    }}
                />

                <div
                    className="badge-row"
                    style={{
                        justifyContent: "center",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >

                    {prettyThemes().map(theme => (

                        <div
                            key={theme}
                            className="theme-badge"
                        >

                            {themeDictionary[theme]?.label ?? theme}

                        </div>

                    ))}

                </div>

            </div>
            {/* ====================================================== */}
            {/* SESSION                                                */}
            {/* ====================================================== */}

            <div className="panel-card">

                <div className="card-title">

                    Session

                </div>

                <div className="stats-grid">

                    <StatTile
                        label="Solved"
                        value={correct}
                    />

                    <StatTile
                        label="Wrong"
                        value={wrong}
                    />

                    <StatTile
                        label="Accuracy"
                        value={`${accuracy}%`}
                    />

                </div>

                <hr
                    style={{
                        border: "none",
                        borderTop: "1px solid #374151",
                        margin: "18px 0",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                        fontSize: 17,
                    }}
                >

                    <span>

                        ⏱ Current

                    </span>

                    <strong>

                        {formatTime(seconds)}

                    </strong>

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 17,
                    }}
                >

                    <span>

                        🏆 Fastest

                    </span>

                    <strong>

                        {formatTime(bestTime)}

                    </strong>

                </div>

            </div>

            {/* ====================================================== */}
            {/* ACTIONS                                                */}
            {/* ====================================================== */}

            <button
                className="action-button"
                onClick={() =>
                    setHintLevel(h =>
                        Math.min(h + 1, 2)
                    )
                }
            >

                💡 Hint

            </button>

            <button
                className="action-button secondary"
                onClick={() =>
                    setSolutionVisible(true)
                }
            >

                ▶ Show Solution

            </button>

            <button
                className="action-button danger"
                onClick={nextPuzzle}
            >

                ⏭ Skip Puzzle

            </button>

        </div>

    );

}
// ==========================================================
// Reusable Session Tile
// ==========================================================

function StatTile({

    label,

    value,

}) {

    return (

        <div className="stat-tile">

            <div className="stat-value">

                {value}

            </div>

            <div className="stat-label">

                {label}

            </div>

        </div>

    );

}