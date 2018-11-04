'use strct';

// Creamos un Controller que nos servirá para asociar a rutas en app.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcrypt');

/**
 * POST /
 * Crea un jsonwebtoken JWT.
 */
router.post('/', async (req, res, next) => {
  try {
    // recoger parámetros del cuerpo de la petición
    const email = req.body.email;
    const password = req.body.password;

    //buscar el usuario
    const usuario = await Usuario.findOne({ email: email });
  
    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      res.json({ success: false, error: res.__('Invalid credentials') })
      return;
    }

    // usuario encontrado y password ok
    // no meter instancias de mongoose en el token!
    jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '15d'
    }, (err, token) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ success: true, token: token });
    });

  } catch (err) {
    next(err);
  }
});

//exportamos el router
module.exports = router;