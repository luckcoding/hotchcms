const express = require('express')
const path = require('path')

module.exports = ({ server, files }) => {
  files.forEach((file) => {
    server.use(file, express.static(path.join(__dirname, '../static', file)))
  })
}
