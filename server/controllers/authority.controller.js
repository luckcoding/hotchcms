const { parse } = require('../lib/authority.lib')

exports.list = async (ctx) => {
  try {
    const { authorities } = ctx

    const routeNotes = parse(authorities)

    ctx.pipeDone(routeNotes)
  } catch (e) {
    ctx.pipeFail(e)
  }
}
