import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function BlogContent(){

    const {id} = useParams(); // accedemos al id que se paso desde la URL desde el componente de Blogs.jsx
    const [blogContent, setBlog] = React.useState(""); // estado para almacenar info del blog
    const navigate = useNavigate();

    async function showBlogContent() {

        try {
            const response = await axios.get(`http://localhost:4000/api/getBlogContent/${id}`); // hacemos solicitud al back para traer la info de este blog al front
            setBlog(response.data); // datos del blog ya guardados en blogContent
        } catch (error) {
            console.log("Error cargando el blog", error);
        }   
    }

    function editarBlog(e) {
        e.preventDefault();
        navigate(`/editBlog/${id}`); // pasamos id del blog al componente de editar, alli verificamos con token si el blog fue creado por el usuario para darle el permiso de editarlo
    }

    React.useEffect(() =>{
        showBlogContent(); // ejecutar una vez cargado el componente
    }, []);


    return (
        <div>
            <NavBar />
            <h1>{blogContent.title}</h1>
            <p>{blogContent.blog}</p>
            <button onClick={editarBlog}>Editar blog</button>
            <button>Eliminar Blog</button>
            <Footer />
        </div>
    );
}

export default BlogContent;