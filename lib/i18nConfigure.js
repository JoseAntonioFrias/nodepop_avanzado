'use strict';

const i18n = require('i18n');
const path = require('path');

/**
 * Función que devuelve la configuración del locale
 */
module.exports = function () {
  i18n.configure({
    locales: ['en', 'es'],
    directory: path.join(__dirname, '..', '/locales'),
    defaultLocale: 'en',
    autoReload: true,
    syncFiles: true,
    cookie: 'nodepop-lang' //usar locale de esta cookie por encima de cabecera Accept-Language
  });

  //locale por defecto para los scripts
  i18n.setLocale('en');

  return i18n;
}