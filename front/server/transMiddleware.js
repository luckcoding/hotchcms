const get = require('lodash/get')

module.exports = (options = {}) => {

  const langs = options.languages || []
  const defaultLang = options.defaultLanguage || 'zh'
  const app = get(options, 'app')

  if (!app) throw TypeError ('options.app must be next.js server app')

  return (req, res, next) => {
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i]
      const regx = new RegExp(`((^\/${lang}$)|(^\/${lang}\/))`, 'g')
      if (regx.test(req.url)) {
        req.locale = lang
        let renderPath = req.url.replace(regx, '/')
        return app.render(req, res, renderPath, req.params)
      } else {
        req.locale = defaultLang
      }
    }
    next()
  }
}