const captcha = require('../lib/captcha.lib');
const jwt = require('jsonwebtoken');

exports.captcha = ctx => {
  const source = captcha();
  ctx.redis.set('captcha', source.code, 'EX', 10)
  // ctx.captcha = source.code;
  ctx.pipeDone(source.dataURL);
};

exports.check = async (ctx, next) => {
  try {
    const _id = ctx.state.user.data;
    const auth = ctx.request.headers.authorization.split(' ')[1];
    const reply = await ctx.redis.get(auth);
    reply === _id ? await next() : ctx.pipeFail('BN99', '用户未登录');
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};