import "./RightPanel.css";
import { usePractice } from "../context/PracticeContext";
import { themeDictionary } from "../utils/themeDictionary";

export default function RightPanel({
    nextPuzzle
}) {

    const {

      puzzle,
      correct,
      wrong,
      accuracy,
      streak,

      hintLevel,
      setHintLevel,

      setSolutionVisible,

      selectedTheme,
      setSelectedTheme,

      minRating,
      setMinRating,

      maxRating,
      setMaxRating,

    } = usePractice();

    if (!puzzle) return null;

    function difficulty(rating){

        if(rating < 800) return "🟢 Beginner";
        if(rating < 1200) return "🔵 Novice";
        if(rating < 1600) return "🟡 Intermediate";
        if(rating < 2000) return "🟠 Advanced";

        return "🔴 Expert";

    }
    function sideToMove() {

      const turn = puzzle.fen.split(" ")[1];

      return turn === "w"
          ? "⚪ White to Move"
          : "⚫ Black to Move";

    }
    function prettyThemes(){

        return puzzle.themes
            .split(" ")
            .slice(0,5);

    }

    return (

        <div className="right-panel">

            <div className="panel-title">

                ♟ Practice

            </div>

            <div className="panel-card">
            <div className="panel-card">

              <div className="card-title">

                  Training Setup

              </div>

              <label>Theme</label>

              <select
                  value={selectedTheme}
                  onChange={(e) =>
                      setSelectedTheme(e.target.value)
                  }
                  className="setup-select"
              >

                  <option value="mateIn1">Mate in One</option>

                  <option value="mateIn2">Mate in Two</option>

                  <option value="fork">Forks</option>

                  <option value="pin">Pins</option>

                  <option value="skewer">Skewers</option>

                  <option value="opening">Opening</option>

                  <option value="middlegame">Middlegame</option>

                  <option value="endgame">Endgame</option>

              </select>

              <label style={{marginTop:16,display:"block"}}>

                  Rating

              </label>

              <div
                  style={{
                      display:"flex",
                      gap:12,
                      width: "100%",
                  }}
              >

                  <input
                      type="number"
                      value={minRating}
                      onChange={(e)=>
                          setMinRating(Number(e.target.value))
                      }
                      className="setup-input"
                  />

                  <input
                      type="number"
                      value={maxRating}
                      onChange={(e)=>
                          setMaxRating(Number(e.target.value))
                      }
                      className="setup-input"
                  />

              </div>

          </div>
                <div className="card-title">

                    Difficulty

                </div>

                <div>

                    {difficulty(puzzle.rating)}

                </div>

                <div className="rating-number">

                    {puzzle.rating}

                </div>
                <hr
                  style={{
                      border: "none",
                      borderTop: "1px solid #4b5563",
                      margin: "16px 0"
                  }}
              />

              <div
                  style={{
                      fontSize: "18px",
                      fontWeight: 600
                  }}
              >
                  {sideToMove()}
              </div>
            </div>

            <div className="panel-card">

                <div className="card-title">

                    Themes

                </div>

                <div className="badge-row">

                    {prettyThemes().map(theme=>(

                        <div
                            key={theme}
                            className="theme-badge"
                        >

                            {themeDictionary[theme] ?? theme}

                        </div>

                    ))}

                </div>

            </div>

            <div className="panel-card">

                <div className="card-title">

                    Session

                </div>

                <div className="stats-grid">

                    <div className="stat-tile">

                        <div className="stat-value">

                            {correct}

                        </div>

                        <div className="stat-label">

                            Solved

                        </div>

                    </div>

                    <div className="stat-tile">

                        <div className="stat-value">

                            {wrong}

                        </div>

                        <div className="stat-label">

                            Wrong

                        </div>

                    </div>

                    <div className="stat-tile">

                        <div className="stat-value">

                            {accuracy}%

                        </div>

                        <div className="stat-label">

                            Accuracy

                        </div>

                    </div>

                    <div className="stat-tile">

                        <div className="stat-value">

                            {streak}

                        </div>

                        <div className="stat-label">

                            Streak

                        </div>

                    </div>

                </div>

            </div>

            <button
                className="action-button"
                onClick={() =>
                    setHintLevel(h => Math.min(h + 1,2))
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