import "./Layout.css";

export default function Layout({ sidebar, board, panel }) {
  return (
    <div className="layout">
      <aside className="layout-sidebar">
        {sidebar}
      </aside>

      <main className="layout-board">
        {board}
      </main>

      <aside className="layout-panel">
        {panel}
      </aside>
    </div>
  );
}