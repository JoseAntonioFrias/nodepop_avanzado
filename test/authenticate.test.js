//importación de librerías
const request = require('supertest');
require('dotenv').config();
// cargamos la aplicación que queremos probar
const app = require('../app');

//==================== authenticate API test ====================

/**
 * Testing post authenticate endpoint
 */
describe('POST /', function (done) {
    let data = {
      "email": 'user@example.com',
      "password": "1234"
    }
    it('respond with json containing an object with jsonwebtoken', function () {
      request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect('"OK"')
        .expect(200, done);
    });
  });


/**
 * Testing post authenticate endpoint with error: Invalid credentials.
 */
describe('POST /', function (done) {
    let data = {
      "email": 'user@example.com',
      "password": "123433"
    }
    it('respond with json containing an object with error: Invalid credentials.', function () {
      request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect('"OK"')
        .expect(200, done);
    });
  });  