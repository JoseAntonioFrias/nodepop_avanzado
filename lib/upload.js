'use strict';

//importaciones de módulos
const multer = require('multer');
const path = require('path');

/**
 * determinamos la ruta donde vamos a subir la imagen, en este caso, la carpeta anuncios
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../public/images/anuncios'));
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

//Guardamos la imagen en la ruta especificada
const upload = multer({ storage: storage });

//exportamos el módulo
module.exports = upload;