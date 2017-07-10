const _ = require('lodash');
const client = require('../lib/redis.lib');

module.exports = function (options) {
  return async (ctx, next) => {

    ctx.redis = client;

    ctx.cache = {};

    ctx.token = null;

    await next();


    _.forEach(ctx.cache, item => {
      for (var key in item) {
        if ({}.hasOwnProperty.call(item, key)) {
          if (item[key] === null) {

          } else {
            client.set('captcha', source.code, 'EX', 10)
          }
        }
      }
    })


  };
};