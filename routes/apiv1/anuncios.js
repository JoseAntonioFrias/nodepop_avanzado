'use strict';

//importaciones de módulos
const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const upload = require('../../lib/upload');
const { body, validationResult } = require('express-validator/check');
const { checkTags, checkSales } = require('../../lib/utils');
const jwtAuth = require('../../lib/jwtAuth');
const cote = require('cote');
const path = require('path');


// Protegemos todo el middleware con JWT Auth
router.use(jwtAuth());

//declaramos el requester
const requester = new cote.Requester({ name: 'convert thumbnail client' });

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

		//crear el objeto vacío para mostrar todos los anuncios, por no haber filtros
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

		// la vista se renderiza (calcula) EN EL SERVIDOR
		res.json({ success: true, result: anuncios });

	} catch (error) {
		next(error);
	}
});

/**
 * POST /
 * Crea un anuncio en la colección.
 */
router.post('/', upload.single('image'), [ //validaciones de los campos de entrada
	body('nombre').not().isEmpty().withMessage('El campo nombre es obligatorio')
		.not().isAlphanumeric().withMessage('El campo nombre es alfanumérico'),
	body('precio').not().isEmpty().withMessage('El campo precio es obligatorio')
		.isFloat({ min: 0.0 }).withMessage('El campo precio es numérico'),
	body('tags').not().isEmpty().custom(checkTags),
	body('foto').not().isEmpty().withMessage('El campo foto es obligatorio')
		.not().isAlphanumeric().withMessage('El campo foto es alfanumérico'),
	body('venta').not().isEmpty().custom(checkSales)
], async (req, res, next) => {

	try {
		let validatio = validationResult(req);

		//si hay errores
		if (!validatio.isEmpty()) {
			// pasa los errores de validación a next(err)
			validationResult(req).throw();
			return;
		} else {
			//recogemos los datos del cuerpo de la solicitud o request 
			const datosAnuncio = req.body;

			//creamos un anuncio en memoria
			const anuncio = new Anuncio(datosAnuncio);

			//lo guardamos en la BBDD.
			const anuncioGuardado = await anuncio.save();

			//mandamos la respuesta con el anuncio guardado
			res.json({ success: true, result: anuncioGuardado });

			//Rutas de las carpetas donde guardamos las imagenes
			const urlImageOrigin = path.join(__dirname, process.env.WEBSITE_IMAGES_FOLDER, anuncioGuardado.foto);
			const urlImageDestination = path.join(__dirname, process.env.THUMBNAIL_IMAGES_FOLDER, anuncioGuardado.foto);

			//Tarea en background: llamada al microservicio
			await requester.send({
				type: 'convertToThumbnail', // quienquiera que escuche peticiones de tipo 'convertToThumbnail'
				urlImageOrigin: urlImageOrigin,
				urlImageDestination: urlImageDestination
			}, res => {
				if(res.success === true){
					console.log(`Respuesta del servicio: ==> ${res.success} `, Date.now());
				}else{
					console.log(`Respuesta del servicio: ==> ${res.error} `, Date.now());
				}
			});

		}

	} catch (error) {
		next(error);
	}
});


/**
 * GET /tags
 * Retorna la lista de tags existentes en la colección de anuncios.
 */
router.get('/tags', async (req, res, next) => {
	try {
		const tags = await Anuncio.distinct('tags');

		//enviamos datos en formato JSON
		res.json({ success: true, result: tags });

	} catch (error) {

		next(error);
	}
});

//exportamos el router
module.exports = router;