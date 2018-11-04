'use strict';

const jwt = require('jsonwebtoken');

/**
 * Módulo con función que devuelve un middleware.
 * El middleware verifica si el token JWT es válido
 */
 module.exports = function() {
   return (req, res, next) => {

    // leer el token
    const token = req.body.token || req.query.token || req.get('x-access-token');

    if (!token) {
      const err = new Error('No token provided');
      err.status = 401;
      next(err);
      return;
    }

    // verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, descodificado) => {
      if (err) {
        if(err.name === 'TokenExpiredError'){
          err.status = 401;
          err.message = 'JWT token has expired';
        }
    
        next(err);
        return;
      }
      req.apiUserId = descodificado._id;

      // llamar a next
      next();

    });

   }
 }