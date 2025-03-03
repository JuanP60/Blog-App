import { Navigate, Outlet } from "react-router-dom";

function Restricted(){
    // en mi componente de lgin ya setee previamente en local storage el valor de isAuth
    const auth = JSON.parse(localStorage.getItem("auth")) || {isAuth: false};// Verifica si el usuario está autenticado, le damos valor por defecto de false por si isAuth es null

    return auth.isAuth ? <Outlet /> : <Navigate to="/" />; // Si no está autenticado, redirige al login, outlet ya que este componente esta wrappeando la ruta restricted
    // si no esta autenticado se redirecciona al home. Uso de operador ternario.
}

export default Restricted;