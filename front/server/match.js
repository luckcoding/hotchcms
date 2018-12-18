const cloneDeep = require('lodash/cloneDeep')
/**
 *  match render
 */
module.exports = ({ app, server, routes = [], languages = [], defaultLanguage = '' }) => {
  
  if (!(app
    && server
    && Array.isArray(routes)
    && Array.isArray(languages)
    && (typeof defaultLanguage === 'string'))) throw TypeError('options Error')
  
  // all the route will be match
  // like '/' '/p/:id' '/zh' '/zh/p/:id' '/en' '/en/p/:id' ...
  let routesMap = []

  routes.forEach(route => {
    ['', ...languages].forEach(language => {
      let packed = `/${language}/${route}`
      packed = packed.replace(/\/{2,}/g, '/')
      routesMap.push({
        packed,
        original: route,
        language: language || defaultLanguage,
      })
    })
  })

  // render with next.js
  routesMap.map(routeObj => {
    const { packed, original, language } = routeObj

    const parts = original.split('\/\:');
    const renderPath = parts[0]
      , matchKey = parts[1]

    server.get(packed, (req, res) => {
      req.locale = language
      return app.render(req, res, renderPath, { [matchKey]: req.params[matchKey] })
    })
  })
}