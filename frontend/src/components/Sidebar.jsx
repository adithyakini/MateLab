import "./Sidebar.css";

export default function Sidebar() {

    return (

        <div className="sidebar">

            {/* ====================================== */}
            {/* Logo                                  */}
            {/* ====================================== */}

            <div className="sidebar-top">

                <div className="logo">

                    ♞

                </div>

                <div className="app-title">

                    MateLab

                </div>

                <div className="app-version">

                    v1.0 Beta

                </div>

                {/* ================================== */}
                {/* Navigation                         */}
                {/* ================================== */}

                <div className="menu">

                    <button className="menu-item active">

                        ♟ Practice

                    </button>

                </div>

            </div>

            {/* ====================================== */}
            {/* Footer                                */}
            {/* ====================================== */}

            <div className="sidebar-footer">

                <div className="footer-divider"></div>

                <div className="footer-db">

                    ♟ Powered by the
                    <br />
                    Lichess Puzzle Database

                </div>

                <div className="footer-tagline">

                    ❤️ Designed in Bengaluru, IN
                    <br />
                    Built for every chess player.

                </div>

                <div className="footer-author">

                    A. Kini

                </div>

            </div>

        </div>

    );

}