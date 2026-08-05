import "./Sidebar.css";

export default function Sidebar() {

    return (

        <div className="sidebar">

            <div className="sidebar-top">

                <div className="logo">

                    ♞

                </div>

                <div className="app-title">

                    MateLab.ai

                </div>

                <div className="app-version">

                    v1.0 Beta

                </div>

                <div className="menu">

                    <button className="menu-item active">
                        🎯 Practice
                    </button>

                    <button className="menu-item">
                        📚 Learn
                    </button>

                    <button className="menu-item">
                        🏆 Challenge
                    </button>

                    <button className="menu-item">
                        📈 Progress
                    </button>

                    <button className="menu-item">
                        ⚙ Settings
                    </button>

                </div>

            </div>

            <div className="sidebar-footer">

                <div className="footer-divider"></div>

                <div className="footer-db">

                    ♟ Puzzle data from the
                    <br />
                    Lichess Puzzle Database

                </div>

                <div className="footer-tagline">

                    ❤️ Designed in Bengaluru.
                    <br />
                    Built for every chess player.

                </div>

                <div className="footer-author">

                    — A. Kini

                </div>

            </div>

        </div>

    );

}