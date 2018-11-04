'use strict';

/**
 * Servicio que convierte una imagen en miniatura de 100 x 100
 */

 //importaciones de módulos
const cote = require('cote');
const jimp = require('jimp');

//Instanciamos el Responder
const responder = new cote.Responder({ name: 'convert thumbnail responder' });

/**
 * Evento que responde a la petición o request que envió el cliente o requester.
 */
responder.on('convertToThumbnail', (req, done) => {
  jimp.read( req.urlImageOrigin )
  .then(image => {
    return image
      .resize(100, 100) // resize
      .quality(60) // set JPEG quality
      .write( req.urlImageDestination ); // save
  })
  .catch(err => {
    console.error(err);
    done( {success: false, error: err.message} );
  });
  
  done( {success: true} );
  
});
