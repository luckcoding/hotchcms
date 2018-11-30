var request = require('./helpers');

describe('1. install tests', function () {
  describe('a. Hotchcms install status', function () {
    it('HTTP status should be 200', function (done) {
      request
        .get('/api/install')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    })
  })

  describe('b. mongodb connect status', function () {
    it('HTTP status should be 200', function (done) {
      request
        .put('/api/install/test-database')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    })
  })

  describe('c. redis connect status', function () {
    it('HTTP status should be 200', function (done) {
      request
        .put('/api/install/test-redis')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    })
  })

  describe('d. install test', function () {
    it('HTTP status should be 200', function (done) {
      request
        .post('/api/install')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    })
  })
})