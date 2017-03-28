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
    check: function (argument) {
      // body...
    }
  })
}

var KoaAuthority = function (options) {
  options = options || {};
  this.models = options.models || {};
  return async function(ctx, next) {
    var url = _.trimEnd(ctx.request.url, '/'); // 获取url
    var method = ctx.request.method;
    for (var i = 0; i < this.models.length; i++) {
      var model = this.models[i];
      if (model[url] && model[url].includes(method)) {
        return await next();
      }
    }
  }
};