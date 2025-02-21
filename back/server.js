// importamos cors y express:

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

// creamos nuestra app con express:

const app = express();
const port = 4000;

dotenv.config(); // se añade para trabajar con las variables de entorno

// puerto escuchando:

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static("public")); // para leer estilos y html

// conexion a base de datos usamos .env para no mostrar las credenciales e informacion importante en el deploy:

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect(); // conectamos a la base de datos


