// importamos cors y express:

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt"; // libreria para hashing de contraseñas
import jwt from "jsonwebtoken"; // lib para manejo de tokens
import path from "path"; // para la ruta de los archivos publicos
import { fileURLToPath } from "url";

// creamos nuestra app con express:

const app = express();
const port = 4000;
const saltRounds = 5; // salting rounds for passwords

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // se añade para trabajar con las variables de entorno

const SECRET_KEY = process.env.SECRET_KEY;

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
app.use(express.static(path.join(__dirname, "front", "public"))); // para usar archivos publicos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Necesario para recibir JSON en el body, para leer lo que envia el front con axios

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

                        // usando JWT para manejo de tokens:

                        const token = jwt.sign({email}, SECRET_KEY, {expiresIn: "10h"});

                        // confirmacion al front de que el user ha sido logueado:

                        res.json({token, success: true, message: "Bienvenido!"});
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
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
        //console.log(error);
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
            res.json({success: false, message: "Correo ya registrado, inicie sesión"});
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
        const query = await db.query("SELECT * FROM blogs");
        const result = query.rows; // en query.rows esta las filas devueltas de la consulta

        if (result.length >= 0){ // si hay mas de 0 consultas devueltas
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

    const {blogT, blogContent} = req.body;  

    // console.log(req.header.authorization);

    // express pasa el nombre de los headers a miniscula, por esa razon puedo evaluar authorization
    const authHeader = req.headers.authorization; // accediendo al token
    const token = authHeader.split(" ")[1]; // Extraemos solo el token
    const decoded = jwt.verify(token, SECRET_KEY); // Verificamos
    const email = decoded.email; // Extraemos el email del usuario
    // console.log(token); // check
    // console.log(email); // check
    
    // toDo: añadir programacion defensiva para el uso del token
    try {
        // insertamos datos a la base:
        const query = await db.query("INSERT INTO blogs (blog, created_by, title) VALUES ($1, $2, $3) RETURNING * ", [blogContent, email, blogT]);
        const result = query.rows;
        console.log(result[0]);

        // returning me ddevuelve la misma fila que acabe de insertar.
        if (result.length > 0){
            res.json({newBlog: result[0]});
        } else {
            res.json({success: false});
        }

    } catch (error) {   
        console.log(error);
    }
});

app.get("/api/getMyBlogs", async (req, res) =>{

    const authHeader = req.headers.authorization; // accediendo al token
    const token = authHeader.split(" ")[1]; // Extraemos solo el token
    const decoded = jwt.verify(token, SECRET_KEY); // Verificamos
    const email = decoded.email; // Extraemos el email del usuario

    // añadir programacion defensiva para manejo de tokes

    try {
        const query = await db.query("SELECT * FROM blogs WHERE created_by = $1", [email]);
        const result = query.rows;

        if (result.length > 0){
            res.json({blogs: result}); // enviamos los datos devuelta al front
        } else {
            res.status(404).json({message: "Blog no encontrado"});
        }
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/getBlogContent/:id", async (req, res) =>{

    const {id} = req.params; // accediendo al id pasado desde del front

    try {
        const query = await db.query("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        const result = query.rows;

        if (result.length > 0){
            res.json(result[0]);
        } else {
            res.status(404).json({message: "Blog no encontrado"});
        }
    } catch (error) {
        console.log(error);
    }
});

app.post("/api/updateBlog/:id", async (req, res) => {

    const {id} = req.params; // accediendo al id pasado desde del front
    const {title, blog} = req.body; // accediendo a los datos pasados en el cuerpo de la solicitud

    // para el token:

    const authHeader = req.headers.authorization; // accediendo al token
    const token = authHeader.split(" ")[1]; // Extraemos solo el token
    const decoded = jwt.verify(token, SECRET_KEY); // Verificamos
    const email = decoded.email; // Extraemos el email del usuario

    try {
        const query = await db.query("UPDATE blogs SET title = $1, blog = $2 WHERE blog_id = $3 AND created_by = $4 RETURNING *", [title, blog, id, email]);
        const result = query.rows;

        if (result.length > 0){
            res.json({success: true, message: "Blog actualizado!"});
        } else {
            res.json({success: false, message: "Usuario actual no es dueñ@ del blog"});
        }
    } catch (error) {
        console.log(error); // ToDO: mejorar manejo de errores.
    }
});

app.post("/api/eliminarBlog/:id", async (req, res) =>{

    const {id} = req.params; // accediendo al id del blog que se quiere eliminar

        // para el token:

    const authHeader = req.headers.authorization; // accediendo al token
    const token = authHeader.split(" ")[1]; // Extraemos solo el token
    const decoded = jwt.verify(token, SECRET_KEY); // Verificamos
    const email = decoded.email; // Extraemos el email del usuario

    try {
        const query = await db.query("DELETE FROM blogs WHERE blog_id = $1 AND created_by = $2 RETURNING *", [id, email]); // si se elimina con exito, se devuele el objeto eliminado
        const result = query.rows;

        if (result.length > 0){
            res.json({success: true, message: "Blog eliminado correctamente"});
        } else {
            res.json({sucess: false, message: "Error al intentar eliminar el blog o no eres dueño de este blog"});
        }
    } catch (error) {
        console.log(error);
    }
});

// puerto escuchando:

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

