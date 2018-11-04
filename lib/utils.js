'use strict';

//variables globales:
// lista de tags existentes y valores booleanos permitidos.
const tags = ['work', 'lifestyle', 'motor', 'mobile'];
const sales = ['true', 'false'];


/**
 * Función que nos permite saber si una ruta está dentro de nuestra API.
 * @param {Request} req Request
 */
module.exports.isAPI = function(req){
    return req.originalUrl.indexOf('/apiv') === 0;
};

/**
 * Función personalizada de validator espress para validar las tags introducidas.
 * @param {object} valor Valor del campo Tags del anuncio.
 */
module.exports.checkTags = function( valor ) {

    //array para ir guardando los tags validados.
    let tagsValidos = [];

    // comprobamos si se han introducido un tag => String o varios => Object
    let queryTags = typeof valor === 'object' ? valor : [valor];

    //iteramos por las tags introducidas comparandolas con las existentes
    queryTags.forEach( tag => {
        //si no está contenida en el array de tags lanzamos un error.
        if (tag.length === 0 || tags.indexOf(tag) === -1) {
            throw new Error(`El tag introducido: '${tag}' es incorrecto. Tiene que ser: work, lifestyle, motor o mobile`);
        }

        // Si el tag está repetido lanzamos un error también.
        if( tagsValidos.indexOf( tag ) === 0 ){
            throw new Error(`El tag introducido: '${tag}' es incorrecto. No pueden repertirse los tags`);
        }

        //array auxiliar para guardar los tags que hemos ido validando y que nos sirve para comprobar
        //si está duplicado.
        tagsValidos.push( tag );

    });
    return true;
};

/**
 * Función personalizada de validator espress para validar el campo venta(true o false)
 * @param {string} valor Valor del campo venta del anuncio.
 */
module.exports.checkSales = function ( valor ) {
    //si no está contenida lanzamos un error
    if (valor.length === 0 || sales.indexOf(valor) === -1) {
        throw new Error(`El valor introducido es incorrecto. Tiene que ser: true o false`);
    }
    
    return true;
};