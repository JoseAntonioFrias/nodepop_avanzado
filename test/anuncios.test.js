//importación de librerías
const request = require('supertest');
require('dotenv').config();
// cargamos la aplicación que queremos probar
const app = require('../app');

//==================== anuncios API test ====================

/**
 * Testing get all anuncios(ads) endpoint
 */
describe('GET /', function (done) {
  it('respond with json containing a list of all anuncios(Ads).', function () {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmRhYmI1ZDlkYTliNTIwYzg5ZDU4MzEiLCJpYXQiOjE1NDEwOTY0MTEsImV4cCI6MTU0MjM5MjQxMX0.jTqp1AkzGurczXJVp3GsiOKYNFI7GNvbOglDDZCw9Io')
      .expect('"OK"')
      .expect(200, done);
  })
})


/**
 * Testing get all anuncios(ads) without jsonwebtoken
 */
describe('GET /', function (done) {
  it('respond with json containing message error: No token provided.', function () {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect('"Unauthorized"')
      .expect(401, done);
  })
})


/**
 * Testing get all tags endpoint
 */
describe('GET /tags', function (done) {
  it('respond with json containing a list of all tags.', function () {
    request(app)
      .get('/tags')
      .set('Accept', 'application/json')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmRhYmI1ZDlkYTliNTIwYzg5ZDU4MzEiLCJpYXQiOjE1NDEwOTY0MTEsImV4cCI6MTU0MjM5MjQxMX0.jTqp1AkzGurczXJVp3GsiOKYNFI7GNvbOglDDZCw9Io')
      .expect('Content-Type', /json/)
      .expect('"OK"')
      .expect(200, done);
  })
})


/**
 * Testing post anuncio(ad) endpoint
 */
describe('POST /', function (done) {
  let data = {
    "tags": ["lifestyle"],
    "foto": "bit-aves-medianas-10-638.jpg",
    "nombre": "bit aves medianas",
    "venta": true,
    "precio": 1000
  }
  it('respond with json containing a anuncio(ad) saved.', function () {
    request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmRhYmI1ZDlkYTliNTIwYzg5ZDU4MzEiLCJpYXQiOjE1NDEwOTY0MTEsImV4cCI6MTU0MjM5MjQxMX0.jTqp1AkzGurczXJVp3GsiOKYNFI7GNvbOglDDZCw9Io')
      .send(data)
      .expect('Content-Type', /json/)
      .expect('"OK"')
      .expect(200, done);
  });
});


/**
 * Testing post anuncio(ad) without jsonwebtoken
 */
describe('POST /', function (done) {
  let data = {
    "tags": ["lifestyle"],
    "foto": "bit-aves-medianas-10-638.jpg",
    "nombre": "bit aves medianas",
    "venta": true,
    "precio": 1000
  }
  it('respond with json containing message error: No token provided.', function () {
    request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect('"Unauthorized"')
      .expect(401, done);
  });
});
