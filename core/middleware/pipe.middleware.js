/**
 * ======================
 * codes
 * ----------------------
 * 200: 成功
 * 4XX: 业务级别错误
 * 5XX: 系统级别错误
 */
const _ = require('lodash');
const logger = require('../lib/logger.lib');
const categorys = require('../config/log4js.config').categorys;

module.exports = options => {
  
  options = options || {};

  return async (ctx, next) => {
    try {
      // 存错返回数据格式
      ctx._pipeDoneData = {};
      ctx._pipeFailData = {};

      // 返回
      ctx.pipeDone = function (result) {
        ctx._pipeDoneData = _.isEmpty(result)
        ? { code: 200 }
        : { code: 200, result: result };
      };
      ctx.pipeFail = function (code, msg, result) {
        ctx._pipeFailData = { code, msg };
        if (_.includes(categorys, _.get(result, 'type'))) {
          logger[result.type]().error(__dirname, '失败原因: ', JSON.stringify(result));
        }
      };

      await next();

      // 拦截错误验证
      if (ctx.validationErrors()) {
        ctx.body = {
          code: 400,
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
      // const status = err.status || 400
      // if (status === 400) {
      //   console.log('err======>',err)
      // } else {
      //   ctx.app.emit('error', err, ctx)
      // }

    }
  };
};