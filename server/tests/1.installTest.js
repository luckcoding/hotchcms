const request = require('./helpers')

describe('1. install tests', () => {
  describe('a. Hotchcms install status', () => {
    it('HTTP status should be 200', done => {
      request
        .get('/api/install')
        .expect(200)
        .end((err, res) => {
          done()
        })
    })
  })

  describe('b. mongodb connect status', () => {
    it('HTTP status should be 200', done => {
      request
        .put('/api/install/test-database')
        .expect(200)
        .end((err, res) => {
          done()
        })
    })
  })

  describe('c. redis connect status', () => {
    it('HTTP status should be 200', done => {
      request
        .put('/api/install/test-redis')
        .expect(200)
        .end((err, res) => {
          done()
        })
    })
  })

  describe('d. install test', () => {
    it('HTTP status should be 200', done => {
      request
        .post('/api/install')
        .expect(200)
        .end((err, res) => {
          done()
        })
    })
  })
})
