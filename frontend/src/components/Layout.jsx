import "./Layout.css";

export default function Layout({ sidebar, board, panel }) {
    return (
        <div className="layout">

            <div className="layout-sidebar">
                {sidebar}
            </div>

            <main className="layout-board">
                {board}
            </main>

            <aside className="layout-panel">
                {panel}
            </aside>

        </div>
    );
}