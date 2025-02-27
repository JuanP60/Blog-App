import React from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";

function CrearBlog(){

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [blogCreado, setBlog] = React.useState("");
    const navigate = useNavigate();
   
    async function crearBlog(e){
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/crearBlog", { // con GET se envian los datos al back como parametros.
                blogT: title,
                blogContent: content,
                createdBy: author
            });

            const result = response.data.newBlog;
            console.log(result)
        
            if (result) {
                setBlog("Blog creado!");
                navigate(`/myBlog/${result.blog_id}`); // redirigimos al blog creado, desde ese componente hacemos solicitud al back para mostrar los datos.
            } else {
                setBlog("Error creando el blog :(");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Crear tu blog personalizado con tus historias!</h1>
            <form>
                <textarea name="title" id="" placeholder="Titulo" onChange={e => setTitle(e.target.value)}></textarea>
                <textarea name="content" id="" placeholder="Content" onChange={e => setContent(e.target.value)}></textarea>
                <input type="text" placeholder="Creado por:" onChange={e => setAuthor(e.target.value)}/>
                <button onClick={crearBlog}>Crear blog</button>
            </form>
            <p>{blogCreado}</p>
        </div>
    );
}

export default CrearBlog;