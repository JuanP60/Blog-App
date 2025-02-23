import { Navigate, Outlet } from "react-router-dom";

function Restricted(){
    // en mi componente de lgin ya setee previamente en local storage el valor de isAuth
    const isAuth = localStorage.getItem("isAuth"); // Verifica si el usuario está autenticado

    return isAuth ? <Outlet /> : <Navigate to="/" />; // Si no está autenticado, redirige al login, outlet ya que este componente esta wrappeando la ruta restricted
    // si no esta autenticado se redirecciona al home. Uso de operador ternario.
}

export default Restricted;