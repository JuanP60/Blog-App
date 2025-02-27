import React from "react";
import Login from "./Login";
import Register from "./Register";
import Blogs from "./Blogs";
import CrearBlog from "./CrearBlog";
import Myblog from "./Myblog";
import Restricted from "./RestrictedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />}/>
                <Route element={<Restricted />}>
                    <Route path="/blogs" element={<Blogs />} />
                </Route>
                <Route path="/crearBlog" element={<CrearBlog />} />
                <Route path="/myBlog/:id" element={<Myblog />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

// browserrouter solo debe de haber 1 en toda mi app, es el container para mis rutas, dentro de Router pongo las rutas indivuales.
// tambien esta el link que seria el reemplazo del a de html