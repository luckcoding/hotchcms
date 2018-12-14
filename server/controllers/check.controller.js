const cache = require('../lib/cache.lib')

/**
 * 校验
 */
module.exports = () => async (ctx, next) => {
  try {
    let _id = ctx.state.user._id.toString()
    const auth = ctx.request.headers.authorization.split(' ')[1]
    const reply = await cache.get(auth)

    // reply === _id ? await next() : ctx.pipeFail('用户未登录', 'TK99')
    // 校验黑名单方式
    reply === _id ? ctx.pipeFail('用户未登录', 'TK99') : await next()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
