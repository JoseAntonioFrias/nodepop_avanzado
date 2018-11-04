'use strict';

//importación de librearías
var express = require('express');
var router = express.Router();
const Anuncio = require('../models/Anuncio');
const namedRoutes =  require('../lib/namedRoutes');

/**
 * GET /
 * Retorna una lista de anuncios con filtros, ordenación y paginación
 */
router.get('/', async (req, res, next) => {
  try {
      //recuperar datos de entrada
      //filtros de búsqueda
      let tag = req.query.tag;
      let nombre = req.query.nombre;
      let venta = req.query.venta;
      let precio = req.query.precio

      //paginación
      let skip = parseInt(req.query.skip);
      let limit = parseInt(req.query.limit);

      //ordenación
      let sort = req.query.sort || null;

      //crear el objeto vacío para mostrar todos los agentes, por no haber filtros
      let filtros = {};

      // puede haber uno o varios tags
      if (tag) {
          filtros.tags = { $all: tag };
      }

      if (nombre) {
          filtros.nombre = new RegExp('^' + nombre, "i");
      }

      if (venta) {
          filtros.venta = venta;
      }

      if (precio) {
          let pos = precio.indexOf('-');

          if (pos === -1) {
              filtros.precio = precio;
          } else if (pos === 0) {
              precio = precio.replace('-', '');
              filtros.precio = { $lte: precio };
          } else if (pos === precio.length - 1) {
              precio = precio.replace('-', '');
              filtros.precio = { $gte: precio };
          } else {
              let precioMinimo = precio.substr(0, pos);
              let precioMaximo = precio.substr(pos + 1, precio.length - 1);

              filtros.precio = { $gte: precioMinimo, $lte: precioMaximo };
          }
      }

      //llamamos al método estático
      let anuncios = await Anuncio.lista(filtros, limit, skip, sort);
      //res.json({ success: true, result: anuncios });

      // la vista se renderiza (calcula) EN EL SERVIDOR
      res.render(namedRoutes.index, { anuncios });

  } catch (error) {
      next(error);
  }
});


module.exports = router;

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

