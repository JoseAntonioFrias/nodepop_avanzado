'use strict';

//importación de librerías
const express = require('express');
const router = express.Router();


router.get('/:locale', (req, res, next) => {
	try {
		//recuperar el código del lenguaje que me piden
		const locale = req.params.locale

		//guardar la pagina a la que hay que volver
		const backTo = req.get('referer');

		//establecemos la cookie del nuevo idioma
		res.cookie('nodepop-lang', locale, { maxAge: 1000 * 60 * 60 * 24 * 14 });

		//redirigimos al usuario donde estaba
		res.redirect(backTo);

	} catch (error) {
		next(error);
	}

});

module.exports = router;