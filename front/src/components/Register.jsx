import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "../styles/register.scss";
import DrawIcon from '@mui/icons-material/Draw';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Register(){

    const [email, setEmail] = React.useState("");
    const [pass1, setPass1] = React.useState("");
    const [pass2, setPass2] = React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate(); // hook para redireccionar al user luego de authentication. En realidad debo usar useParams ya que manejo ids de usuarios

    async function registerUser(event){

        event.preventDefault();

        // primero verificamos que la contraseña este entre 8 y 16 caracteres:
        const validPass = pass1.length;

        if (validPass > 8 && validPass <= 16 && pass1 === pass2){
            console.log("contraseña valida");
            // enviamos datos al server para registrar el user y hacerle hashing a la contraseña.
            try {

                const response = await axios.post("http://localhost:4000/api/register", {
                    newUserEmail: email,
                    newUserPass: pass1
                });

                const isRegistered = response.data; // respuesta del server.

                if (isRegistered.success){
                    navigate("/"); // para que inicie sesion
                    //localStorage.setItem("isAuth", "true"); // para restringir la ruta
                } else {
                    console.log("Error registrando el user");
                    setError(isRegistered.message);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setError("Ingresa correo válido o válida la contraseña");
            console.log("Las contraseñas no coinciden o no son válidas, intente de nuevo");
        }
    }

    return (
        <div className="father-container">

            <div className="nav-container">
                <h1>MyBlog! <DrawIcon className="pencil-icon"/></h1>
            </div>

            <form className="register-form">
                <div className="logo-container">
                    <HowToRegIcon className="register-icon" />
                </div>
                <h1 className="register-header">Crea tú cuenta!</h1>
                <input className="input-register" type="email" name="email" placeholder="Ingresar correo" required onChange={(e) => setEmail(e.target.value)}/>
                <input className="input-register" type="password" name="password" placeholder="Contraseña" required onChange={(e) => setPass1(e.target.value)}/>
                <input className="input-register" type="password" name="passwordCn" placeholder="Confirmar contraseña" required onChange={(e) => setPass2(e.target.value)} />
                <button className="btn-register" onClick={registerUser}>Registrarse</button>
            </form>

            <p>{error}</p>

            {error && <p className="user-exists">Si ya tienes una cuenta inicia sesión <Link to="/">aquí.</Link></p>}

            <div className="foot-container">
                <Footer />
            </div>
        </div>
    )
}

export default Register;