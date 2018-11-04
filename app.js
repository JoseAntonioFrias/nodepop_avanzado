//importación de módulos dependentes
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//importamos la función isAPI del módulo de utilidades
const { isAPI } = require('./lib/utils');


// Llamada a express
var app = express();

// view engine setup. Configuración para trabajar con templates EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Para servir ficheros estáticos
app.use(express.static(path.join(__dirname, 'public')));

/**
 * CONFIGURACIÓN  MULTIIDIOMA EXPRESS DEL MÓDULO i18n
 */
const i18n = require('./lib/i18nConfigure')();

//metemos el middleware del modulo i18n en la cadena de middlewares de Express.
//Además busca en Head de la petición la cabecera HTTP ACCEPT-LANGUAGE que indica
//la preferencia de idioma del usuario y se lo pasa al Middelware de Express y a la vistas.
app.use(i18n.init);


//variables globales del template
app.locals.titulo = 'Nodepop';

/**
 * Nos conectamos a la BBDD y registramos los modelos
 */
require('./lib/connectMongoose');
require('./models/Anuncio');
require('./models/Usuario');

/**
 * Rutas de las API's
 */
app.use('/apiv1/anuncios',      require('./routes/apiv1/anuncios'));
app.use('/apiv1/authenticate',  require('./routes/apiv1/authenticate'));

/**
 * Rutas de mi aplicación web
 */
app.use('/',     require('./routes/index'));
app.use('/lang', require('./routes/lang'));

/**
 * Middleware que renderiza la vista de error cuando ningún mddleware se ha ejecutado porque no existe la ruta.
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // error de validación
    if (err.array) {
      err.status = 422;
      const errorInfo = err.array({ onlyFirstError: true })[0];
      err.message =  isAPI(req) ? 
        { message: 'Not valid', errors: err.mapped() } 
        : `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
    }
  
    res.status(err.status || 500);
  
    if (isAPI(req)) {
      res.json({ success: false, error: err.message });
      return;
    }
  
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.render('error');
    
  });

module.exports = app;
