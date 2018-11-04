'use strict';

//Importaciones de módulos de terceros
const mongoose = require('mongoose');

/**
 * Definición del esquema Anuncio
 */
var anuncioSchema = mongoose.Schema({
	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
	tags: [String]
});

//añadimos el índice a la colección
anuncioSchema.index({ nombre: 1, precio: 1, tags: 1, venta: 1, foto: 1 });

/**
 * Método estático para filtros y paginación de la lista de anuncios.
 * @param {Object} filtros Filtros por los que la lista puede ser filtrada.
 * @param {Number} limit Número máximo de documentos que se trae la lista de anuncios. Se utiliza en la paginación.
 * @param {Number} skip Número de documentos que no se trae la lista de anuncios. Se utiliza en la paginación.
 * @param {String} sort Campo por el cual se ordena la lista de anuncios.
 */
anuncioSchema.statics.lista = function (filtros, limit, skip, sort) {
	const query = Anuncio.find(filtros);
	query.limit(limit);
	query.skip(skip);
	query.sort(sort);

	return query.exec();
}

//Creación del modelo a partir del esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

//Exportamos el modelo aunque no haga falta
module.exports = Anuncio;