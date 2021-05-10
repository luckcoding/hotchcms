const supertest = require('supertest')
const chai = require('chai')
const portLib = require('../lib/port.lib')

const expect = chai.expect
const port = portLib()

const request = supertest(`http://localhost:${port}`)

exports.expect = expect
module.exports = request
