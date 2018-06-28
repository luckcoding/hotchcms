exports.list = async (ctx) => {
  try {
    const { authorities } = ctx
    const { notes } = global.Route

    const routeNotes = authorities.map(item => {
      const path = Object.keys(item)[0]
      const methods = item[path]
      const suffix = methods[methods.length - 1]
      const prefix = `${path}[${suffix.toLowerCase()}]`
      return {
        prefix,
        name: notes[prefix],
        value: item,
      }
    })

    ctx.pipeDone(routeNotes)
  } catch (e) {
    ctx.pipeFail(e)
  }
}
