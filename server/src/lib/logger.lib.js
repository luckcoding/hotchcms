const fs = require('fs')
const path = require('path')
const tracer = require('tracer')

// 日志
const dailyfile = tracer.dailyfile({
  root: path.join(__dirname, '../../logs'),
  maxLogFiles: 10,
  // level: 'warn',
  format: '{{timestamp}} {{message}}',
  dateformat: 'mm-dd HH:MM:ss'
})

// 打印
const colorConsole = tracer.colorConsole();

// 简单绑定功能
// 可读性👍
function logger() {
  return {
    log: colorConsole.log,
    trace: colorConsole.trace,
    debug: colorConsole.debug,
    info: colorConsole.info,
    warn () {
      colorConsole.warn.apply(null, arguments)
      dailyfile.warn.apply(null, arguments)
    },
    error () {
      colorConsole.error.apply(null, arguments)
      dailyfile.error.apply(null, arguments)
    },
  }
}

/**
 * 网络监听日志
 * @param  {Number} effect 阈值
 */
const httpEffectMiddle = (effect = 1000) => async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  const loggerType = ms > effect ? 'warn' : 'info'
  logger()[loggerType](`${ctx.method} ${ctx.url} - ${ms}ms`)
}

module.exports = logger
module.exports.httpEffectMiddle = httpEffectMiddle