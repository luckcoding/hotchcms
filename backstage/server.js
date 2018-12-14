const express = require('express')
const compression = require('compression')
const path = require('path')
const resolve = require('path').resolve

const app = express()

app.use(compression())

function setup (app, options) {
  const publicPath = options.publicPath || '/'
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'dist')

  app.use(publicPath, express.static(outputPath))
  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')))
}

setup(app, {
  outputPath: resolve(process.cwd(), 'dist'),
  publicPath: '/',
})

app.listen(8080, 'localhost', (err) => {
  if (err) {
    return console.error(err.message)
  }

  console.log('管理平台服务启动, 端口: ' + 8080)
})