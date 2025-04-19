import React from "react";
import Login from "./Login";
import Register from "./Register";
import {Blogs} from "./Blogs";
import CrearBlog from "./CrearBlog";
import Myblog from "./Myblog";
import BlogContent from "./BlogContent";
import EditBlog from "./EditBlog";
import Restricted from "./RestrictedRoute";
import Support from "./Support";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// lo que esta en future solo se puso para que no salieran los warnings en el navegador sobre las futuras versiones de react-router
// permite adelantar en mi app cambios que puedan venir en la version 7
function App(){
    return(
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />}/>
                <Route element={<Restricted />}>
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogContent/:id" element={<BlogContent />}/>
                    <Route path="/crearBlog" element={<CrearBlog />} />
                    <Route path="/myBlogs" element={<Myblog />}/>
                    <Route path="/editBlog/:id" element={<EditBlog />}/>
                    <Route path="/support" element={<Support />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

// browserrouter solo debe de haber 1 en toda mi app, es el container para mis rutas, dentro de Router pongo las rutas indivuales.
// tambien esta el link que seria el reemplazo del a de html