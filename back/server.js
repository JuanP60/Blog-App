// importamos cors y express:

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt"; // libreria para hashing de contraseñas

// creamos nuestra app con express:

const app = express();
const port = 4000;
const saltRounds = 5; // salting rounds for passwords

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
        const result = await db.query("SELECT * FROM users WHERE correo = $1", [email]);

        if (result.rows.length > 0){ // si hay mas de 1 row devuelta
            const user = result.rows[0]; // accedemos al array donde la query nos esta dando, user_id, correo, password
            const storedHashedPassword = user.password; // aca accedemos a la password guardada en el registro la cual fue hasheada

            // metodo de la libreria bcrypt para comprar contraseñas:

            bcrypt.compare(pass, storedHashedPassword, (err, result) =>{ // recibe: password nueva, password ya hasheada, (hace la comparacion), callback(error, resultado)
                if (err){
                    console.log("Error comparing passwords:", err);
                } else {
                    if (result){ // parametro de la arrow function, si result es true luego de la comparativa, enviamos respuesta al frontend
                        res.json({success: true, message: "Bienvenido!"});
                    } else {
                        res.send("Incorrect password");
                    }
                }
            });
            //console.log("user found");
        } else { // si no salieron rows de la consulta quiere decir que el user no se ha registrado
            res.json({success: false});
            console.log("user not found");
        }
    } catch (error) {
        console.log(error);
    }

    //ToDo: hacer Hashing de password - check
    //console.log(email + " y la contrasela es: " + pass);
});

app.post("/api/register", async (req, res) =>{

    const {newUserEmail, newUserPass} = req.body; // aca obtenemos datos que vienen desde el front, ahora vamos a hashear la contraseña para guardarla los datos en la db
    //console.log("correo a registrar: " + newUserEmail + " con la pass: " + newUserPass);

    try {
        const query = await db.query("SELECT * FROM users WHERE correo = $1", [newUserEmail]); // antes del registro verificamos si ya habia un perfil creado con ese correo

        if (query.rows.length > 0){
            res.send("El correo ya esta registrado, incie sesión");
        } else {
            bcrypt.hash(newUserPass, saltRounds, async (err, hash) =>{
                if (err){
                    console.log("Error hashing password:", err);
                } else {
                    const result = await db.query("INSERT INTO users (correo, password) VALUES ($1, $2)", [newUserEmail, hash]);
                    res.json({success: true}); // enviamos confirmacion al front de que el user ha sido registrado
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/blogs", async (req, res) =>{
    // solicitud a la db para mostrar todos los blogs:

    try {
        const query = await db.query("SELECT title FROM blogs");
        const result = query.rows; // en query.rows esta las filas devueltas de la consulta

        if (result.length > 0){ // si hay mas de 0 consultas devueltas
            res.json({blogs: result});
        } else {
            res.send("Error en la consulta");
        }
    } catch (error) {
        res.send(error);
    }
});

app.post("/api/crearBlog", async (req, res) =>{
    // estamos pasando por params los datos del front entonces:

    const {blogT, blogContent, createdBy} = req.body;  

    try {
        // insertamos datos a la base:
        const query = await db.query("INSERT INTO blogs (blog, created_by, title) VALUES ($1, $2, $3) RETURNING * ", [blogContent, null, blogT]);
        const result = query.rows;
        // returning me ddevuelve la misma fila que acabe de insertar.
        if (result.length > 0){
            res.json({success: true});
        } else {
            res.json({success: false});
        }

    } catch (error) {   
        console.log(error);
    }
});

// puerto escuchando:

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

