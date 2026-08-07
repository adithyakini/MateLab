import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Worksheet from "./pages/Worksheet";

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