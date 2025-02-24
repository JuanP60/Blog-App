import React from "react";
import { useNavigate } from "react-router-dom";

function Blogs(){

    const navigate = useNavigate(); // hook para redireccionar al user luego de authentication. En realidad debo usar useParams ya que manejo ids de usuarios

    function cerrarSesion(){
        localStorage.clear(); // borramos el estado de isAuth.
        navigate("/"); 
    }   

    return (
        <div>
            <h1>My blogs</h1>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
    );
}

export default Blogs;