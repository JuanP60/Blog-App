import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Myblog(){

    const {id} = useParams(); // accedemos al id que se paso desde la URL
    const [blog, setBlog] = React.useState(""); // estado para almacenar info del blog

    async function showBlog() {

        try {
            const response = await axios.get(`http://localhost:4000/api/getBlog/${id}`);
            setBlog(response.data);
        } catch (error) {
            console.log("Error cargando el blog", error);
        }   
    }

    React.useEffect(() =>{
        showBlog();
    }, []);

    return (
        <div>
            <NavBar />
            <h1>MyBlog!</h1>
            <h1>{blog.title}</h1>
            <Footer />
        </div>
    );
}

export default Myblog;