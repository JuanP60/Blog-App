import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import "../styles/editBlog.scss";
import {NavMovil} from "./Blogs";
import ClipLoader from "react-spinners/ClipLoader"; // logo loading

function EditBlog(){

    const [currentBlog, setCurrentBlog] = React.useState({});
    const [loading, setLoading] = React.useState(true); // estado para el loader

    // console.log(currentBlog);   // en current blog ya se esta guardando el objeto que viene desde el backend con la consulta: blog, blog_id, created_by, title
    const {id} = useParams(); // accediendo al id del blog pasado desde la URL.
    const navigate = useNavigate();

    // consulta para traer current data del blog.

    async function showCurrentBlog(){
        try {
            const response = await axios.get(`http://localhost:4000/api/getBlogContent/${id}`);
            setCurrentBlog(response.data); // asignamos valores del blog que esta siendo editado

            // esperamos 1s antes de quitar el loader

            setTimeout(() => {
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.log(error);
            setLoading(false); // por si hay error y no se trae el blog correctamente
        }
    }

    function handleChange(e){
        const {name, value} = e.target; // el name del textarea debe matchear con el nombre de la columna que viene del back, ya que react compara que name se edito,
        // y busca el mismo name en currentBlog para actualizarlo

        setCurrentBlog((prev) => {
            return {
                ...prev, // traemos todos los elementos registrados anteriormente con el spread operator
                [name]: value // dependiendo del name que se edite, le asignamos el value, se usa [] para que react lo tome como una clave dinamica
            }
        });
    }

    //consulta para editar el blog y preguntar al back si el autor del blog es el que esta logueado:

    async function editingBlog(e) {
        e.preventDefault();

        const auth = JSON.parse(localStorage.getItem("auth")); // pasando de JSON a objeto js, extrayendo token de localstorage el cual se crea luego de que el user incia sesion
    
        try {
            const response = await axios.post(`http://localhost:4000/api/updateBlog/${id}`, {
                title: currentBlog.title, // estos nombres pueden ser cualquieras, ya que son parte del cuerpo de la solicitud, se deben llamar igual en el back(title, blog)
                blog: currentBlog.blog 
            },
            {
                headers: {Authorization: `Bearer ${auth.token}`} // pasamos token al back
            }
        );
        const result = response.data;
        console.log(result);

        if (result.success){
            navigate("/myBlogs");
        } else if (!result.sucess) {
            alert(result.message);
        }

        } catch (error) {
            console.log(error);
        }
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

    React.useEffect(() => {
        showCurrentBlog();
    }, []); 

    return (

        <div>

            <NavMovil />

            <div className="desk-nav">
                <NavBar/>
            </div>

            {loading ? (
                 <div className="spinner-container">
                    <ClipLoader color="#ffc107" size={50} />
                    <p>Cargando blog...</p>
                </div>
            ) : (

                <div className="blog-crear-container">

                    <div className="title-container-crear">
                        <h1>Editando {currentBlog.title}</h1>
                        <EditNoteIcon className="add-icon" />
                    </div>

                    <form className="form-father">
                    
                        <textarea name="title" id="title" value={currentBlog.title} onChange={handleChange}></textarea>
                        <textarea name="blog" id="content" value={currentBlog.blog} onChange={handleChange}></textarea>
                        <p className="autor-text">Autor: {currentBlog.created_by}</p>

                        <div className="buttons-container">
                            <button className="edit-button" onClick={editingBlog}><EditIcon className="edit-icon"/></button>
                            <button className="delete-button" onClick={eliminarBlog}><DeleteIcon className="delete-icon" /></button>
                        </div>

                    </form> 

                </div>
            )}

             <div className="foot-container-blogs">
                <Footer />
             </div>
        </div>
    );
}

export default EditBlog;

// mejorar manejo de errores. Añadir estilos a la app.