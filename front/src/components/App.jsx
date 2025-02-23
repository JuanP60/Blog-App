import React from "react";
import Login from "./Login";
import Blogs from "./Blogs";
import Restricted from "./RestrictedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<Restricted />}>
                    <Route path="/blogs" element={<Blogs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

// browserrouter solo debe de haber 1 en toda mi app, es el container para mis rutas, dentro de Router pongo las rutas indivuales.
// tambien esta el link que seria el reemplazo del a de html