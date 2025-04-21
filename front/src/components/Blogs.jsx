import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/blogs.scss";
import BookIcon from '@mui/icons-material/Book';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClipLoader from "react-spinners/ClipLoader";
import DrawIcon from '@mui/icons-material/Draw'; // lapiz
import MenuIcon from '@mui/icons-material/Menu'; // ícono hamburguesa
import CloseIcon from '@mui/icons-material/Close'; // cerrar icono

function NavMovil(){ 
    const [menuOpen, setMenuOpen] = React.useState(false); // para manejar el estado de abierto o cerrado del menu movil
    const navigate = useNavigate();

    // manejo la logica de si aparece o no el menu desde scss con media queries.
    // esto se podria manejar como un componente aparte.

    function homeBlogs(){
        navigate("/blogs");
    }

    function cerrarSesion(){
        navigate("/");
        localStorage.clear(); // borramos el estado de isAuth.
    }

    return (
        <>
            <div className="nav-container1">
                
                <div className="title-nav-mov">
                    <h1 onClick={homeBlogs}>MyBlog! <DrawIcon className="pencil-icon" /></h1>
                </div>

                <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}> 
                {menuOpen ? <CloseIcon className="close-burguer"/> : <MenuIcon className="menu-burguer"/>}
                </div>

                </div>

                {menuOpen && (
                <div className="mobile-menu">
                    <ul className="mobile-items">
                        <li><Link to="/blogs">Blogs comunidad</Link></li>
                        <li><Link to="/myBlogs">Mis blogs</Link></li>
                        <li><Link to="/support">Soporte</Link></li>
                        <li onClick={cerrarSesion}><Link>Cerrar sesión</Link></li>
                    </ul>
            </div>
        )}
        </>
    );
}

// componente principal:

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
        <div className="blogs-father">

            <NavMovil />

            <div className="desk-nav">
                <NavBar/>
            </div>
            
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
                                <Link className="blogs-items-design" key={index} to={`/blogContent/${t.blog_id}`}><span>{t.title}</span>  <VisibilityIcon className="eye-icon"/> </Link>
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

export {Blogs, NavMovil};