import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/blogs.scss";
import BookIcon from '@mui/icons-material/Book';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClipLoader from "react-spinners/ClipLoader";

function Blogs(){

    const [blogs, updateBlogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    async function llamarBlogs(){
        // hacemos solicitud get con axios para mostrar todos los blogs de todos los usuarios
        try {
            const response = await axios.get("http://localhost:4000/api/blogs");
            const result = response.data;
            console.log(result);
            updateBlogs(result.blogs);

            // esperamos 1s antes de quitar el loader

            setTimeout(() => {
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.log(error);
            setLoading(false); // por si hay error y no se traen los blogs
        }
    }

    React.useEffect(() => {
        llamarBlogs(); // Se ejecuta solo cuando el componente se monta
    }, []);

    return (
        <div>

            <NavBar />

            <div className="blogs-father-container">

                <div className="title-container">
                    <h1>Blogs de la comunidad!</h1>
                    <BookIcon className="book-icon" />
                </div>

                <div className="blogs-container">
                    <ul className="items-blogs-container">

                        {loading ? (
                            <div className="spinner-container">
                                <ClipLoader color="#ffc107" size={50} />
                                <p>Cargando blogs...</p>
                            </div>
                        ) : blogs.length > 0 ? ( // con ( ) la arrow devuelve automaticamente el valor sin necesidadd de usar return
                            blogs.map((t, index) =>(
                                <Link className="blogs-items-design" key={index} to={`/blogContent/${t.blog_id}`}><li>{t.title}</li>  <VisibilityIcon className="eye-icon"/> </Link>
                            )) 
                        ): (
                            <li>No hay blogs disponibles</li>
                        )}

                    </ul>

                </div>
            </div>

            <div className="foot-container-blogs">
                <Footer />
            </div>

        </div>
    );
}

export default Blogs;