const isEmpty = require('lodash/isEmpty')

/**
 *  match render
 */
module.exports = ({ server, app, routes }) => {
  routes.map(route => {
    const path = route.split('\/\:')[0];

    server.get(route, (req, res) => {
      return app.render(req, res, path, req.params)
    })
  })
}