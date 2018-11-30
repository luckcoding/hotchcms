var supertest = require('supertest')
var portLib = require('../lib/port.lib')
var chai = require('chai')

var expect = chai.expect
var port = portLib()

var request = supertest('http://localhost:' + port)

exports.expect = expect
module.exports = request