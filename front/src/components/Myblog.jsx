import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BookIcon from '@mui/icons-material/Book';

function Myblog(){

    const [blogs, setBlogs] = React.useState([]); // estado para almacenar info del los blogs

    async function showBlogs() {

        const auth = JSON.parse(localStorage.getItem("auth")); // pasando de JSON a objeto js

        try {
            const response = await axios.get("http://localhost:4000/api/getMyBlogs", {
                headers: { Authorization: `Bearer ${auth.token}`},
            });

            setBlogs(response.data.blogs);
        } catch (error) {
            console.log("Error cargando el blog", error);
        }   
    }

    React.useEffect(() =>{
        showBlogs();
    }, []);

    return (
        <div>
            <NavBar />

            <div className="blogs-father-container">

                <div className="title-container">
                    <h1>My Blogs!</h1>
                    <BookIcon className="book-icon" />
                </div>

                <ul>
                    {blogs.length > 0 ? (
                        blogs.map((t, index) => (
                            <Link key={index} to={`/blogContent/${t.blog_id}`}><li>{t.title}</li></Link>
                    )) 
                    ) : (
                        <li>No tienes blogs por el momento</li>
                    )}
                </ul>
            </div>

            <div className="foot-container-blogs">
                <Footer />
            </div>
        </div>
    );
}
// agregar funcionalidad de editar, eliminar blog, solo cuando son los blogs del propio usuario
// agregar boton para compartir el blogs publicamente.
export default Myblog;