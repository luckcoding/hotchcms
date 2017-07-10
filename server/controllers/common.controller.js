const captcha = require('../lib/captcha.lib');

/**
 * 验证码
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.captcha = ctx => {
  const source = captcha();
  ctx.redis.set('captcha', source.code, 'EX', 10)
  // ctx.captcha = source.code;
  ctx.pipeDone(source.dataURL);
};