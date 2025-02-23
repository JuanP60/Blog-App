// importamos cors y express:

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

// creamos nuestra app con express:

const app = express();
const port = 4000;

// puerto escuchando:

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

dotenv.config(); // se añade para trabajar con las variables de entorno

// conexion a base de datos usamos .env para no mostrar las credenciales e informacion importante en el deploy:

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect(); // conectamos a la base de datos
app.use(cors()); // todos los puertos abiertos para comunicacion front con back y viceversa.

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Necesario para recibir JSON en el body, para leer lo que envia el front con axios

//app.use(express.static("public")); // para leer estilos y html

// solicitudes http realizadas con axios desde el front:

// verificando credenciales en la db:

app.post("/api/login", async (req, res) =>{

    const email = req.body.userEmail;
    const pass = req.body.password;

    try {
        // verificamos en la db si existe el user.
        const result = await db.query("SELECT * FROM users WHERE correo = $1 AND password = $2", [email , pass]);

        if (result.rows.length > 0){ // si hay mas de 1 row devuelta
            res.json({success: true});
            //console.log("user found");
        } else {
            res.json({success: false});
            console.log("user not found");
        }
    } catch (error) {
        console.log(error);
    }

    //ToDo: hacer Hashing de password
    //console.log(email + " y la contrasela es: " + pass);
});



