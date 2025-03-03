import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        <form>
            <h1>Inicio de sesión</h1>
            <input onChange={(event) => setEmail(event.target.value)} type="text" name="email" placeholder="Email"/>
            <input onChange={(event) => setPass(event.target.value)} type="password" name="password" placeholder="password" />
            <button onClick={reqLogin} type="submit">Inciar sesión</button>
            <p>{error}</p>
            <button onClick={crearCuenta} type="submit">Crear una cuenta</button>
        </form>
    )
}

export default Login;