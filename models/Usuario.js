'use strict';

//Importaciones de módulos
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Definición del esquema Usuario
 */
var usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

/**
 * Método estático que nos devuelve la contraseña encriptada con el hash de bcrypt.
 * @param { String} plainPassword  
 */
usuarioSchema.statics.hashPassword = function(plainPassword) {
    return bcrypt.hash(plainPassword, 10);
  }

//Creación del modelo a partir del esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

//Exportamos el modelo aunque no haga falta
module.exports = Usuario;