const { parse } = require('../lib/authority.lib')

/**
 * 当前用户权限列表
 */
exports.list = async ctx => {
  try {
    ctx.pipeDone(parse(ctx.state.user.authorities))
  } catch (e) {
    ctx.pipeFail(e)
  }
}
