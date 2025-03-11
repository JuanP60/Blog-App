import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "../styles/login.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DrawIcon from '@mui/icons-material/Draw';
import CheckIcon from '@mui/icons-material/Check';

function Login(){

   const [email, setEmail] = React.useState("");
   const [pass, setPass] = React.useState(""); 
   const [error, setError] = React.useState("");
   const navigate = useNavigate(); // hook para redireccionar al user luego de authentication. En realidad debo usar useParams ya que manejo ids de usuarios

   async function reqLogin (event){
    
        event.preventDefault(); // evitamos refrehear la pagina luego del boton de submit

        // enviando datos al backend para verificar al user:

        try {
            // enviamos en formato JSON la info al backend:

            const response = await axios.post("http://localhost:4000/api/login", {
                userEmail: email,
                password: pass
            });
            // si uso .get necesito params, con post se no es necesario ya que se usa con req.body

            const isAuth = {
                isAuth: response.data.success,
                token: response.data.token
            }; // respuesta del server
           

            if (isAuth.isAuth) { 
                navigate("/blogs"); // redireccionamos el user a la screen blogs
                localStorage.setItem("auth", JSON.stringify(isAuth)); // para restringir la ruta, guardamos token enviado desde el back
                setError("");
            } else {
                console.log(isAuth);
                setError("Verifica tus credenciales o crea una cuenta");
                localStorage.clear(); // borramos el estado de isAuth.
            }

        } catch (error) {
            console.log(error);
        }
    }

    function crearCuenta(event){
        event.preventDefault();

        navigate("/register"); // enviamos al cliente a la pantalla de crear cuenta
    }

    return (
        <div className="father-container">
            <div className="nav-container">
                <h1>MyBlog! <DrawIcon className="pencil-icon"/></h1>
            </div>

            <div className="mid-container">
                <form className="login-form">
                    <div className="logo-container">
                        <AccountCircleIcon className="login-icon"/>
                    </div>
                    <h1 className="login-header">Inicio de sesión</h1>
                    <input className="input-login" onChange={(event) => setEmail(event.target.value)} type="email" name="email" placeholder="Correo" required/>
                    <input className="input-login" onChange={(event) => setPass(event.target.value)} type="password" name="password" placeholder="Contraseña" required/>
                    <button className="btn-login1" onClick={reqLogin} type="submit">Inciar sesión</button>
                    <button className="btn-login2" onClick={crearCuenta} type="submit">Crear una cuenta</button>
                </form>
                <div className="div-container"></div>
                <div className="items-container">
                    <ul>
                        <li> <CheckIcon className="check-login"/> Crea tus blogs!</li>
                        <li> <CheckIcon className="check-login"/> Editalos!</li>
                        <li> <CheckIcon className="check-login"/> Compartelos!</li>
                    </ul>
                </div>
            </div>
            
            <p className="login-error">{error}</p>
            <div className="foot-container">
                <Footer />
            </div>
        </div>
    )
}

export default Login;