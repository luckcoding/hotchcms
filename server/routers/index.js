const _ = require('lodash');

const routes = [
  require('./install.router'),
  require('./site-info.router'),
  require('./common.router'),
  require('./admin-account.router')
];

module.exports = app => {
  _.forEach(routes, route => {
    app
      .use(route.routes())
      .use(route.allowedMethods({
        throw: true
      }));
  });
};

module.exports.routes = routes;