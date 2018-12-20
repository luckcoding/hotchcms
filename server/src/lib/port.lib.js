const _ = require('lodash')
const config = require('../config')

/**
 * 格式化端口
 * @return {[type]} [description]
 */
module.exports = () => {
  let PORT = false

  const portIndex = _.findIndex(process.argv, (arg) => {
    return arg === '--port' || arg === '-p'
  })

  if (portIndex !== -1 && _.isNumber(parseInt(process.argv[portIndex + 1], 10))) {
    PORT = process.argv[portIndex + 1]
  }

  const val = PORT || process.env.PORT || config.server_port
  const port = parseInt(val, 10)

  if (isNaN(port)) return val // named pipe

  if (port >= 0) return port // port number

  return false
}
