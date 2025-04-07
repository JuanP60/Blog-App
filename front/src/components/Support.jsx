import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/support.scss";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function Support(){

    const [text, textSts] = React.useState(""); // para contar caracteres ingresados
    const [error, errorSts] = React.useState("");

    function validInfo(){
        if (text.length < 10){
            errorSts("Envía información Válida!");
        } else {
            errorSts("Gracias por tu comentario, te comunicaremos lo antes posible!");
            console.log(text.length);
            textSts("");
        }
    }

    return (
        <div>
            <NavBar />

            <div className="support-box">
                <div className="support-box-flex">
                    <h1 className="title-support">¿Necesitas ayuda? Escribenos!</h1>
                    <hr className="support-line"/>

                    <textarea 
                    name="support-area" 
                    placeholder="Escribe aquí tu duda..." 
                    className="text-support" 
                    onChange={e => textSts(e.target.value)}
                    value={text}
                    ></textarea>

                    <hr className="support-line"/>
                    <button className="btn-support" onClick={validInfo}>Enviar</button>

                    <p>{error}</p>

                    <div className="redes">
                        <FacebookOutlinedIcon className="redes-icons"/>
                        <InstagramIcon className="redes-icons"/>
                        <WhatsAppIcon className="redes-icons"/>
                    </div>
                </div>
            </div>

            <div className="foot-container-blogs">
                <Footer />
            </div>
        </div>
    );
}

export default Support;