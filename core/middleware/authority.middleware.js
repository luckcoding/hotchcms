const _ = require('lodash');
const routes = require('../routers').routes;

let authorities = [];
const methods = ['POST', 'PUT', 'GET', 'HEAD', 'OPTIONS', 'DELETE'];

module.exports = () => {
  _.forEach(routes, route => {
    _.forEach(route.stack, stack => {
      const isAll = (_.intersection(methods, stack.methods)).length === methods.length;
      authorities = _.concat(authorities, {
        [_.trimEnd(stack.path, '/')]: isAll ? ['*'] : stack.methods
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
    // _.trimEnd(ctx.request.url);
    // console.log(ctx.request.url, ctx.request.method, this.authorities)
    await next();
  }
};

// KoaAuthority.prototype.method_name = function(first_argument) {
//   // body...
// };

// module.exports = KoaAuthority;