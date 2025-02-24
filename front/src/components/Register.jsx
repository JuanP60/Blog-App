import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){

    const [email, setEmail] = React.useState("");
    const [pass1, setPass1] = React.useState("");
    const [pass2, setPass2] = React.useState("");
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
                    navigate("/blogs");
                    localStorage.setItem("isAuth", "true"); // para restringir la ruta
                } else {
                    console.log("Error registrando el user");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Las contraseñas no coinciden o no son válidas, intente de nuevo");
        }
    }

    return (
        <form>
            <h1>Crea tú cuenta!</h1>
            <input type="text" name="email" placeholder="Ingresar email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="password" placeholder="Contraseña" onChange={(e) => setPass1(e.target.value)}/>
            <input type="password" name="passwordCn" placeholder="Confirmar contraseña" onChange={(e) => setPass2(e.target.value)} />
            <button onClick={registerUser}>Registrarse</button>
        </form>
    )
}

export default Register;