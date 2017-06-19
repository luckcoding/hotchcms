const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

function KoaAuthority(options) {
  let routes = _.isArray(options.routes) ? options.routes : [];
  let authorities = _.isArray(options.authorities) ? options.authorities : [];
  let middleware = _.isFunction(options.middleware) ? options.middleware : () => Promise.resolve();
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
    ctx.authorityModels = models;
    ctx.authorities = authorities;

    try {
      await middleware(ctx);

      let check = false;
      _.forEach(ctx.authorities, (model, index) => {
        _.mapKeys(model, (value, key) => {
          const regexp = pathToRegexp(key, []);
          if (regexp.test(ctx.request.url)) return check = true;
        });
      });
      check ? await next() : ctx.app.emit('error', '权限校验失败', ctx);
    } catch (e) {
      ctx.app.emit('error', e.message, ctx);
    }
  }
};

module.exports = KoaAuthority;