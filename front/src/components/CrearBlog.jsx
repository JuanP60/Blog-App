import React from "react";
import axios from "axios";

function CrearBlog(){

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [blogCreado, setBlog] = React.useState("");
   
    async function crearBlog(e){
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/crearBlog", { // con GET se envian los datos al back como parametros.
                blogT: title,
                blogContent: content,
                createdBy: author
            });

            const result = response.data;

            if (result.success){
                setBlog(true);
            } else {
                setBlog(false); // fix this. No quiero que siempre se muestre este mensaje. que solo aparezca cuando en realidadd haya un error.
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
            <p>{blogCreado ? "Blog creado!" : "Error creando el blog :("}</p>
        </div>
    );
}

export default CrearBlog;