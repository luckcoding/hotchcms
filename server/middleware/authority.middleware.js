const _ = require('lodash');
const routes = require('../routers').routes;

let authorities = [];
const methods = ['POST', 'PUT', 'GET', 'HEAD', 'OPTIONS', 'DELETE'];

module.exports = () => {
  _.forEach(routes, route => {
    _.forEach(route.stack, stack => {
      const isAll = (_.intersection(methods, stack.methods)).length === methods.length;
      authorities = _.concat(authorities, {
        [_.trimEnd(stack.path, '/')]: (isAll ? ['*'] : stack.methods)
      });
    });
  });
  return KoaAuthority({
    models: authorities,
    check: function (models, ctx) {
      const URL = _.trimEnd(ctx.request.url, '/');
      const method = ctx.request.method;
      let auth = false;
      _.forEach(models, function (model, index) {
        _.mapKeys(model, function(value, key) {
          if (matchRouter(key, URL) && value.includes(method)) {
            auth = true;
          }
        });
      });
      return auth;
    }
  })
}

function matchRouter(tmpRouter, ckRouter) {
  tmpRouter = tmpRouter.split('/');
  ckRouter = ckRouter.split('/');
  if (tmpRouter.length != ckRouter.length) {
    return false;
  };
  var equal = true;
  for (var i = 0; i < tmpRouter.length; i++) {
    if (tmpRouter[i].indexOf('\:') === -1 && tmpRouter[i] != ckRouter[i]) {
      equal = false;
      break;
    }
  }
  return equal;
}


var KoaAuthority = function (options) {
  options = options || {};
  var models = options.models || {};
  var check = options.check || function () {};
  return async function(ctx, next) {
    check(models, ctx) ? await next() : ctx.app.emit('error', '权限校验失败', ctx);
  }
};
