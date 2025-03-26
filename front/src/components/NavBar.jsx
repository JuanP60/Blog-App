import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/nav.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DrawIcon from '@mui/icons-material/Draw';

function NavBar(){

    const navigate = useNavigate();

    function mostrarSignOut(){
        console.log("funciona");
    }

    function redirectHome(){
        navigate("/blogs");
    }

    return (
        <nav className="nav-container">

            <div className="icon-container" onClick={redirectHome}>
                <DrawIcon className="pencil-iconnav"/>
            </div>

            <ul className="items-container">
                <li><Link to="/blogs">Blogs comunidad</Link></li>
                <li><Link to="/myBlogs">Mis blogs</Link></li>
                <li><Link>Soporte</Link></li>
            </ul>

            <div className="sign-container">
                    <AccountCircleIcon className="sign-logo" onClick={mostrarSignOut}/>
            </div>
        </nav>
    );
}

export default NavBar;