export default function Layout({ sidebar, board, panel }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px minmax(0, 1fr) 360px",
        width: "100vw",
        height: "100vh",
        background: "#1f1f1f",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "#242424",
          borderRight: "1px solid #333",
          height: "100vh",
        }}
      >
        {sidebar}
      </aside>

      {/* Board Area */}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#2b2b2b",
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          padding: "24px",
        }}
      >
        {board}
      </main>

      {/* Right Panel */}
      <aside
        style={{
          background: "#242424",
          borderLeft: "1px solid #333",
          width: "360px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {panel}
      </aside>
    </div>
  );
}