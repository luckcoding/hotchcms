/**
 * ======================
 * codes
 * ----------------------
 * 0000: 成功
 * TK99: Token失效
 * VD99: 验证错误
 * AT99: 权限错误
 * BN99: 业务出错
 * 9999: 其他错误
 */
const _ = require('lodash')
const logger = require('../lib/logger.lib')
const categorys = require('../config/log4js.config').categorys

module.exports = () => async (ctx, next) => {
  try {
    /**
     * 存错返回数据格式
     */
    ctx._pipeDoneData = {}
    ctx._pipeFailData = {}

    /**
     * 返回
     */
    ctx.pipeDone = (result) => {
      ctx._pipeDoneData = { code: '0000', result }
    }
    ctx.pipeFail = (input, code = '9999') => {
      const message = _.get(input, 'message') || input
      const stack = _.get(input, 'stack') || undefined
      ctx._pipeFailData = { code, message }

      const errorType = _.includes(categorys, _.get(input, 'type')) ? input.type : 'system'
      logger[errorType]().error(__dirname, '失败原因: ', stack || message)
    }

    await next()

    // 拦截错误验证
    const validationErrors = ctx.validationErrors()
    if (validationErrors) {
      ctx.body = {
        code: 'VD99',
        message: '参数验证失败',
        stack: validationErrors,
      }
      return logger.system().error(__filename, '参数验证失败', validationErrors)
    }

    // 拦截返回
    if (!_.isEmpty(ctx._pipeFailData)) {
      ctx.body = ctx._pipeFailData
      return null
    }
    if (!_.isEmpty(ctx._pipeDoneData)) {
      ctx.body = ctx._pipeDoneData
      return null
    }
  } catch (err) {
    ctx.app.emit('error', err, ctx)
  }
}
