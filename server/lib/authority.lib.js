/**
 * 解析路由权限、描述
 */
exports.parse = function (authorities = []) {
  const { notes } = global.Route

  return authorities.map(item => {
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
}