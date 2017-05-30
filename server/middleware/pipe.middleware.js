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
const _ = require('lodash');
const logger = require('../lib/logger.lib');
const categorys = require('../../config/log4js.config').categorys;

module.exports = options => {
  
  options = options || {};

  return async (ctx, next) => {
    try {
      // 存错返回数据格式
      ctx._pipeDoneData = {};
      ctx._pipeFailData = {};

      // 返回
      ctx.pipeDone = result => {
        ctx._pipeDoneData = _.isEmpty(result)
        ? { code: '0000' }
        : { code: '0000', result: result };
      };
      ctx.pipeFail = (code, msg) => {
        const errorMsg = _.get(msg, 'error') || msg;
        const errorType = _.includes(categorys, _.get(msg, 'type')) ? msg.type : 'system';
        ctx._pipeFailData = { code: code, msg: errorMsg };
        logger[errorType]().error(__dirname, '失败原因: ', errorMsg);
      };

      await next();

      // 拦截错误验证
      if (ctx.validationErrors()) {
        ctx.body = {
          code: 'VD99',
          msg: '参数验证失败',
          result: ctx.validationErrors()
        }
        return logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
      };

      // 拦截返回
      if (!_.isEmpty(ctx._pipeFailData)) {
        return ctx.body = ctx._pipeFailData;
      }
      if (!_.isEmpty(ctx._pipeDoneData)) {
        return ctx.body = ctx._pipeDoneData;
      }
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  };
};