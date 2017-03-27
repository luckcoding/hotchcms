const config = require('../../config/authorities.config');

/**
 * 查询权限
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
module.exports = ctx => {
  ctx.pipeDone(config);
};