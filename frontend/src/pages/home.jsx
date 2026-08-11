import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
        fontFamily: "Segoe UI",
      }}
    >
      <h1>♟ Chess Puzzle Generator</h1>

      <p>
        Practice real Lichess chess puzzles and improve your tactical skills.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/practice">
          <button style={{ padding: "15px 30px" }}>
            🎯 Practice Puzzle
          </button>
        </Link>
      </div>
    </div>
  );
}