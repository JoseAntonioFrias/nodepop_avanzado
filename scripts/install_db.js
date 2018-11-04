/**
 * Script que se encarga de poblar la base de datos nodepop
 */

'use strict';

console.log("*********** comenzando el script de carga de datos *********\n");

//importamos módulo de conexion si no saldría Error de conexion. MongoParseError: URI malformed, cannot be parsed
require('dotenv').config();

//importamos modulos de Node.js
const readline = require('readline');

//Importamos los ficheros json de datos a cargar
const anuncios = require('../data/anuncios.json').anuncios;
const usuarios = require('../data/usuarios.json').usuarios;

//Conexión con MongoDB
const conn = require('../lib/connectMongoose');

//importamos módulos de los modelos
const Anuncio = require('../models/Anuncio');
const Usuario = require('../models/Usuario');

/**
 * Abrimos la conexión y borramos y cargamos los datos.
 */
conn.once('open', async () => {
  try {
    const response = await askUser('Estas seguro que quieres borrar los contenidos de la base de datos? (N/S): ');

    if (response.toUpperCase() !== 'S') {
      console.log('Proceso abortado');
      process.exit();
    }

    await initAnuncios( anuncios );
    await initUsuarios( usuarios );

    console.log("*********** Fin del script de carga de datos *********");

    //cerramos la conexión
    conn.close();

  } catch (err) {
    console.log('Hubo un error', err);
    process.exit(1);
  }
});


/**
 * Función que crea una interfaz de dialogo con el usuario(I/O) para confirmar la operación
 * por la entrada y salida estándar.
 * @param {String} question Pregunta que introducimos para confirmar la carga.
 */
function askUser(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question,
      function(answer) {
        rl.close();
        resolve(answer);
      }
    );
  });
}


/**
 * Función que elimina y da de alta los anuncios en la BBDD.
 * @param {Object} anuncios Lista de anuncios
 */
async function initAnuncios( anuncios ){
    //eliminar los documentos actuales
    console.log("\n*********** Elimimando anuncios *********");
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${ deleted.n } anuncios.`);
    console.log("*********** Fin de eliminar anuncios *********");

    //cargar los nuevos documentos
    console.log("*********** Creando anuncios *********");
    const inserted = await Anuncio.insertMany( anuncios );
    console.log(`Insertados ${ inserted.length } anuncios.`);
    console.log("*********** Fin de crear anuncios *********\n");
}


/**
 *  Función que elimina y da de alta los usuarios en BBDD.
 * @param {Object} usuarios lista de usuarios
 */
async function initUsuarios( usuarios ){
    //eliminar los documentos actuales
    console.log("*********** Elimimando usuarios *********");
    const deleted = await Usuario.deleteMany();
    console.log(`Eliminados ${ deleted.n } usuarios.`);
    console.log("*********** Fin de eliminar usuarios *********");

    // hacemos hash de las passwords
    for (let i = 0; i < usuarios.length; i++) {
      usuarios[i].password = await Usuario.hashPassword(usuarios[i].password);
    }

    //cargar los nuevos documentos en Mongo
    console.log("*********** Creando usuarios *********");
    const inserted = await Usuario.insertMany( usuarios );
    console.log(`Insertados ${ inserted.length } usuarios.`);
    console.log("*********** Fin de crear usuarios *********\n");
}


