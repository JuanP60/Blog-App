import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/blogContent.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {NavMovil} from "./Blogs";

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

    async function eliminarBlog(e){
        e.preventDefault();

        const auth = JSON.parse(localStorage.getItem("auth"));

        // enviamos id, token al back para eliminar el blog

        try {
            const response = await axios.post(`http://localhost:4000/api/eliminarBlog/${id}`,
                {}, // como no necesito enviar nada en el body se deja vacio, los headers van siempre en el tercer parametro de la axios request
                {
                    headers: {Authorization: `Bearer ${auth.token}`}
                }
            );

            const result = response.data;

            if (result.success){
                alert(result.message);
                navigate("/myBlogs");

            } else if (!result.success) {
                alert(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() =>{
        showBlogContent(); // ejecutar una vez cargado el componente
    }, []);


    return (
        <div>
            
            <NavMovil />

            <div className="desk-nav">
                <NavBar/>
            </div>

            <div className="blog-crear-container">
                <div className="content-father">
                    <h1 className="title-blog-content">{blogContent.title}</h1>
                    <hr className="horizontal-rule-content"/>

                    <p>{blogContent.blog}</p>
                    <hr className="horizontal-rule-content"/>

                    <div className="buttons-container">
                        <button className="edit-button" onClick={editarBlog}><EditIcon className="edit-icon"/></button>
                        <button className="delete-button" onClick={eliminarBlog}><DeleteIcon className="delete-icon" /></button>
                    </div>

                </div>
            </div>

            <div className="foot-container-blogs">
                <Footer />
            </div>
         
        </div>
    );
}

export default BlogContent;