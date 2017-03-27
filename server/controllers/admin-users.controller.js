const logger = require('../lib/logger.lib');
const sha1 = require('../services/sha1.service');
const usersService = require('../services/users.service');

/**
 * 获取单个用户
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.one = async ctx => {
  console.log(ctx.params)
  ctx.checkQuery({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: {errorMessage: '_id 需为 mongoId'}
    }
  });
  if (ctx.validationErrors()) return null;

  const { _id } = ctx.request.query;
  try {
    const user = await usersService.one({ _id: _id });
    ctx.pipeDone(user);
  } catch (e) {
    e.type = 'database';
    ctx.pipeFail(500,'查询失败',e);
  }
};