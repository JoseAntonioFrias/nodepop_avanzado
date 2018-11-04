'use strict';

//importaciones de módulos
const mongoose = require('mongoose');

//creamos la conexión
const conn = mongoose.connection;

//si alguna vez emite el evento error
conn.on('error', err => {
    console.error('Error de conexion', err);
    process.exit(1);
});

//la primera vez que sucede el evento open, abrir conexión e imprimir traza
conn.once('open', () =>
    console.log('Conectado a MongoDB en', conn.name)
);

//le decimos que se conecte a la BBDD Nodepop con dotenv: carga variables de entorno de un 
//fichero .env al process.env
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{ useNewUrlParser: true });

//exporto el objeto conn, aunque no hace falta, lo hacemos por convecniencia.
module.exports = conn;