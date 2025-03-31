import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/blogs.scss";
import BookIcon from '@mui/icons-material/Book';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Blogs(){

    const navigate = useNavigate(); // hook para redireccionar al user luego de authentication. En realidad debo usar useParams ya que manejo ids de usuarios
    const [blogs, updateBlogs] = React.useState([]);

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
                        {blogs.length > 0 ? ( // con ( ) la arrow devuelve automaticamente el valor sin necesidadd de usar return
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