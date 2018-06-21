const fs = require('fs')
const path = require('path')

/**
 * 后台首页
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
module.exports = async (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream(path.join(__dirname, '../publish/backstage/index.html'))
}
