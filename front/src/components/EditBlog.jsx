import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function EditBlog(){

    const [currentBlog, setCurrentBlog] = React.useState({});
    // console.log(currentBlog);   // en current blog ya se esta guardando el objeto que viene desde el backend con la consulta: blog, blog_id, created_by, title
    const {id} = useParams(); // accediendo al id del blog pasado desde la URL.
    const navigate = useNavigate();

    // consulta para traer current data del blog.
    async function showCurrentBlog(){
        try {
            const response = await axios.get(`http://localhost:4000/api/getBlogContent/${id}`);
            setCurrentBlog(response.data); // asignamos valores del blog que esta siendo editado
        } catch (error) {
            console.log(error);
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
        <form>
            <NavBar />  
            <h1>Editando {currentBlog.title}</h1>
            <textarea name="title" id="" value={currentBlog.title} onChange={handleChange}></textarea>
            <textarea name="blog" id="" value={currentBlog.blog} onChange={handleChange}></textarea>
            <p>Autor: {currentBlog.created_by}</p>
            <button onClick={editingBlog}>Editar</button>
            <button onClick={eliminarBlog}>Eliminar Blog</button>
            <Footer />
        </form> 
    );
}

export default EditBlog;

// mejorar manejo de errores. Añadir estilos a la app.