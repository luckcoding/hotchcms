const cache = require('../lib/cache.lib')

/**
 * 校验
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = () => async (ctx, next) => {
  try {
    const _id = ctx.state.user.data
    const auth = ctx.request.headers.authorization.split(' ')[1]
    const reply = await cache.get(auth)
    reply === _id ? await next() : ctx.pipeFail('用户未登录', 'TK99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}
