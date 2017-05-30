const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

function KoaAuthority(routes) {
  let models = [];

  (function mixins(input) {
    if (_.isArray(input)) return _.forEach(input, each => { mixins(each); });
    if (_.has(input, 'stack')) {
      _.has(input, 'path')
      ? models.push({[input.path]: input.methods || []})
      : mixins(input.stack);
    }
  })(routes);

  return async (ctx, next) => {
    ctx.authorityModel = models;
    let check = false;
    _.forEach(models, (model, index) => {
      _.mapKeys(model, (value, key) => {
        const regexp = pathToRegexp(key, []);
        if (regexp.test(ctx.request.url)) check = true;
      });
    });
    check ? await next() : ctx.app.emit('error', '权限校验失败', ctx);
  }
};


module.exports = KoaAuthority;