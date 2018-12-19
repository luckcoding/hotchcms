/**
 * match render
 * to handle diff language url match, url with params and router cache
 * @param  {Object} options.app             next.js app
 * @param  {Object} options.server          express server
 * @param  {Array}  options.routes          routes bind
 * @param  {Array}  options.languages       support langs
 * @param  {String} options.defaultLanguage defalut lang
 * @return {any}                         intercept and handle
 */
module.exports = ({
  app,
  server,
  routes = [],
  languages = [],
  defaultLanguage = '',
  renderFromCache,
}) => {
  
  if (!(app
    && server
    && Array.isArray(routes)
    && Array.isArray(languages)
    && (typeof defaultLanguage === 'string'))) throw TypeError('options Error')
  
  // all the route will be match
  // like '/' '/p/:id' '/zh' '/zh/p/:id' '/en' '/en/p/:id' ...
  let routesMap = []

  routes.forEach(({ route, useCache }) => {
    ['', ...languages].forEach(language => {
      let packed = `/${language}/${route}`
      packed = packed.replace(/\/{2,}/g, '/')
      routesMap.push({
        packed,
        original: route,
        language: language || defaultLanguage,
        useCache,
      })
    })
  })

  // render with next.js
  routesMap.map(({ packed, original, language, useCache }) => {

    const parts = original.split('\/\:');
    const renderPath = parts[0]
      , matchKey = parts[1]

    server.get(packed, (req, res) => {
      // bind locale in ctx.req.locale
      req.locale = language

      // render params
      const args = [req, res, renderPath, { [matchKey]: req.params[matchKey] }]
      return useCache
        ? renderFromCache(...args)
        : app.render(...args)
    })
  })
}