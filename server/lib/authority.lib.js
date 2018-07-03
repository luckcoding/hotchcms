/**
 * 解析路由权限、描述
 */
exports.parse = function (authorities = []) {
  try {
    const { notes } = global.Route
    return authorities.map(item => ({
      prefix: `${item.path}[${item.methods[item.methods.length - 1]}]`,
      get name () {
        return notes[this.prefix]
      },
      value: {
        path: item.path,
        methods: item.methods
      },
    }))
  } catch (e) {
    return []
  }
}