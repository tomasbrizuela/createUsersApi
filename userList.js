const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = 4000

const password = process.env.SQL_PASS
const user = process.env.USER
const database = process.env.DATABASE
const app = express();
app.use(cors())
app.use(bodyParser.json())

const connection = mysql.createConnection({
    'host': 'localhost',
    'user': user,
    'password': password,
    'database': database
});

connection.connect()

app.get('/getUsers', (req, res) => {
    connection.query(`SELECT * FROM userList`, (error, results) => {

        if(error){
            return res.status(500).json({"mensaje": "Error al obtener usuarios", "Error": error.sqlMessage})
        }
        res.json(results)
    })

})

app.post('/createUSer', (req, res) => {
    const { nombre, apellido, email, contraseña }  = req.body
    let query = `INSERT INTO userList ( nombre, apellido, email, contraseña ) VALUES (?, ?, ?, ?)`
    let valores = [nombre, apellido, email, contraseña.length > 8 ? contraseña : null];

    connection.query(query, valores, (error, results) => {
        if(error){
        return res.status(500).json({'mensaje': "Error al crear el usuario", 'error': error.sqlMessage})
        }
        res.status(200).json({mensaje: 'Usuario creado exitosamente'})
        console.log(results)
    })
});

app.put('/editUser', (req, res) => {
    const { nuevoNombre, email } = req.body
    let query = "UPDATE userList SET nombre = ? WHERE email = ?";
    let values = [ nuevoNombre, email ]

    connection.query(query, values, (error, results) => {
        if(error){
            return res.json({"message": "error al editar el usuario", 'error': error.sqlMessage})
        }

        if(results.changedRows == 0){
            return res.status(500).json({'message': 'No hay usuarios que coincidan con el correo'})
        } else {
            res.status(200).json({'message': 'Usuario editado correctamente', 'done': results})
        }

    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/getUsers/\nhttp://localhost:${port}/createUSer`)
});

