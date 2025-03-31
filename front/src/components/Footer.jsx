import React from "react";

function Footer(){

    const year = new Date().getFullYear();

    return (
        <div>
            <p>Copyright@ {year}</p>
        </div>
    );
}

export default Footer;