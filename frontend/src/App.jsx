import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Practice from "./pages/practice";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Practice is now the landing page */}
                <Route
                    path="/"
                    element={<Practice />}
                />

                {/* Keep /practice working */}
                <Route
                    path="/practice"
                    element={<Practice />}
                />

                {/* Anything unknown → Practice */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}