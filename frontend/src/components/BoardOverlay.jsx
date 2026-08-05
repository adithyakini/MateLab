export default function BoardOverlay({ message, color }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          minWidth: 260,
          padding: "22px 40px",
          borderRadius: 18,
          background: color,
          color: "white",
          textAlign: "center",

          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 1,

          opacity: message ? 1 : 0,
          transform: message
            ? "scale(1)"
            : "scale(.75)",

          transition: "all .25s ease",

          boxShadow: "0 18px 50px rgba(0,0,0,.45)",
        }}
      >
        {message}
      </div>
    </div>
  );
}