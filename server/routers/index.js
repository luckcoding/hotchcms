const _ = require('lodash');

const routes = [
  require('./install.router'),
  require('./site-info.router'),
  require('./common.router'),
  require('./admin-group.router'),
  require('./admin-account.router'),
  require('./authority.router'),
  require('./admin-user.router'),
  require('./content-category.router'),
  require('./content.router')
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