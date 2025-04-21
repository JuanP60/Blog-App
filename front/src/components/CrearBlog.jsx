import React from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/creandoBlog.scss";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {NavMovil} from "./Blogs";

function CrearBlog(){

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [blogCreado, setBlog] = React.useState("");
    const navigate = useNavigate();
   
    async function crearBlog(e){
        
        e.preventDefault();

        const auth = JSON.parse(localStorage.getItem("auth")); // objeto guardado en localstorage con token

        try {
            const response = await axios.post("http://localhost:4000/api/crearBlog",
            { // cuerpo de mi solicitud http:
                blogT: title,
                blogContent: content
            },
            { // aca enviamos los headers, generalmente va el token del user
                headers: { Authorization: `Bearer ${auth.token}` } 
            }
        ); // con GET se envian los datos al back como parametros.


            const result = response.data.newBlog;
            console.log(result)
        
            if (result) {
                setBlog("Blog creado!");
                navigate("/myBlogs"); // mostramos todos los blogs que ha creado el usuario logueado
            } else {
                setBlog("Error creando el blog :(");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>

            <NavMovil />

            <div className="desk-nav">
                <NavBar/>
            </div>

            <div className="blog-crear-container">

                <div className="title-container-crear">
                    <h1>Crear tu blog personalizado!</h1>
                    <AddCircleOutlineIcon className="add-icon" />
                </div>

                <form onSubmit={crearBlog} className="form-father">
                    <textarea name="title" id="title" placeholder="Titulo" required onChange={e => setTitle(e.target.value)}></textarea>
                    <textarea name="content" id="content" placeholder="Contenido" required onChange={e => setContent(e.target.value)}></textarea>
                    <input type="text" placeholder="Autor" id="autor-input" required onChange={e => setAuthor(e.target.value)}/>
                    <button type="submit" className="crear-button"> <CheckCircleIcon className="check-icon-crear"/> </button>
                </form>

                <p>{blogCreado}</p>
            </div>

            <div className="foot-container-blogs">
                <Footer />
            </div>

        </div>
    );
}

export default CrearBlog;