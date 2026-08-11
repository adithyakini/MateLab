import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Practice from "./pages/practice";
import Worksheet from "./pages/worksheet";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/practice"
                    element={<Practice />}
                />

                <Route
                    path="/worksheet"
                    element={<Worksheet />}
                />

            </Routes>

        </BrowserRouter>

    );

}