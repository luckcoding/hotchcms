const express = require('express')
const next = require('next')
const compression = require('compression')

const match = require('./match')
const rootStaticFiles = require('./rootStaticFiles')
const renderFromCache = require('./renderFromCache')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare()
  .then(() => {
    const server = express()

    // compression
    if (!dev) {
      server.use(compression());
    }
    
    // static files
    rootStaticFiles({ server, files: [
      '/robots.txt'
    ]})

    // language/cache/match routes
    match({
      app,
      server,
      languages: ['en', 'zh'],
      defaultLanguage: 'zh',
      routes: [
        { route: '/', useCache: true },
        { route: '/about' },
        { route: '/p/:_id' },
      ],
      renderFromCache: renderFromCache(app),
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
