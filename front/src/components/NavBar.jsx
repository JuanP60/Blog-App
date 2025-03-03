import React from "react";
import { Link } from "react-router-dom";

function NavBar(){
    return (
        <ul>
            <li><Link to="/blogs">Blogs comunidad</Link></li>
            <li><Link to="/myBlogs">Mis blogs</Link></li>
            <li><Link>Soporte</Link></li>
        </ul>
    );
}

export default NavBar;