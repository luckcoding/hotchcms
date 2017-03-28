const captcha = require('../lib/captcha.lib');

/**
 * 验证码
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.captcha = ctx => {
  const source = captcha();
  ctx.session.captcha = source.code;
  ctx.pipeDone(source.dataURL);
};