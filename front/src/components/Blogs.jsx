import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Blogs(){

    const navigate = useNavigate(); // hook para redireccionar al user luego de authentication. En realidad debo usar useParams ya que manejo ids de usuarios
    const [blogs, updateBlogs] = React.useState([]);

    function cerrarSesion(){
        localStorage.clear(); // borramos el estado de isAuth.
        navigate("/"); 
    }   

    async function llamarBlogs(){
        // hacemos solicitud get con axios para mostrar todos los blogs de todos los usuarios
        try {
            const response = await axios.get("http://localhost:4000/api/blogs");
            const result = response.data;
            console.log(result);
            updateBlogs(result.blogs);
        } catch (error) {
            console.log(error);
        }

    }

    function creaTuBlogPage(){
        navigate("/crearBlog");
    }

    React.useEffect(() => {
        llamarBlogs(); // Se ejecuta solo cuando el componente se monta
    }, []);

    return (
        <div>
            <h1>My blogs</h1>
            <ul>
                {blogs.map((t, index) =>{ 
                    return <li key={index}>{t.title}</li>
                    // map maneja primer variable la que va a recorrer el array, segunda el index que corresponde al elemento que se esta iterando,
                    // en react cada elemento debe tener su propia key para diferenciarlos
                })}
            </ul>
            <button onClick={creaTuBlogPage}>Crea tu blog</button>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
    );
}

export default Blogs;