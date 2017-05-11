var _ = require('lodash');
var pathToRegexp = require('path-to-regexp');

function KoaAuthority(routes) {
  var models = [];

  (function mixins(input) {
    if (_.isArray(input)) return _.forEach(input, function (each) { mixins(each); });
    if (_.has(input, 'stack')) {
      _.has(input, 'path')
      ? models.push({[input.path]: input.methods || []})
      : mixins(input.stack);
    }
  })(routes);

  return async function(ctx, next) {
    var check = false;
    _.forEach(models, function (model, index) {
      _.mapKeys(model, function(value, key) {
        var regexp = pathToRegexp(key, []);
        if (regexp.test(ctx.request.url)) check = true;
      });
    });
    check ? await next() : ctx.app.emit('error', '权限校验失败', ctx);
  }
};


module.exports = KoaAuthority;