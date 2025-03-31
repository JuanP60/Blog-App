import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/nav.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DrawIcon from '@mui/icons-material/Draw';

function NavBar(){

    const navigate = useNavigate();
    const [popUp, statePopUp] = React.useState(false); // estado para manejar el popup de cerrar sesion

    function mostrarSignOut(){
        statePopUp(!popUp); // popUp alterna con clicks ! -> negacion
        //console.log(popUp);
    }

    function cerrarSesion(){
        localStorage.clear(); // borramos el estado de isAuth.
        navigate("/"); 
    }  

    function redirectHome(){
        navigate("/blogs");
    }

    return (
        <div>
            <nav className="nav-container">

                <div className="icon-container" onClick={redirectHome}>
                    <DrawIcon className="pencil-iconnav"/>
                </div>

                <ul className="items-container">
                    <li><Link to="/blogs">Blogs comunidad</Link></li>
                    <li><Link to="/myBlogs">Mis blogs</Link></li>
                    <li><Link>Soporte</Link></li>
                </ul>

                <div onClick={mostrarSignOut} className="sign-container">
                        <AccountCircleIcon className="sign-logo" onClick={mostrarSignOut}/>
                </div>

                {popUp && 
                <div className="popUp-container">
                    <p className="popLetter-size">Perfil</p>
                    <hr className="linea-popUp"/>
                    <p onClick={cerrarSesion} className="popLetter-size">Cerrar Sesión</p>
                </div>
                }

            </nav>
        </div>
    );
}

export default NavBar;