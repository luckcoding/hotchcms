const log4js = require('koa-log4');
const logger = log4js.getLogger('spider');


exports.spider = async ctx => {
  logger.info('spider')
  ctx.body = { spider: 'spider' };
};