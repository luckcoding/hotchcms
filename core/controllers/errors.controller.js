const logger = require('../lib/logger.lib');

exports.notFound = (ctx, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  ctx.body = {
    error: 404
  }
};