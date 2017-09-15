const log4js = require('koa-log4')
const config = require('../config/log4js.config')

/**
 * 载入配置
 */
log4js.configure(config)

/**
 * 导出日志接口
 */
module.exports = {
  app: () => log4js.getLogger('app'),
  http: () => log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }),
  system: () => log4js.getLogger('system'),
  database: () => log4js.getLogger('database'),
}
