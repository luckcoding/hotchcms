const send = require('koa-send');

/**
 * 后台首页
 * @param {Object} req
 * @param {Object} res
 */
module.exports = async ctx => {
  await send(ctx, './public/assets/admin/index.html');
};