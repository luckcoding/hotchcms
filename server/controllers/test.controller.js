const logger = require('../lib/logger.lib');

exports.checkBody = async ctx => {
  var comment = await ctx.sanitizeHeaders('comment').escape();
  ctx.body = { success: comment };
};

exports.checkQuery = async ctx => {
  ctx.checkQuery({
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    }
  })
  if (ctx.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
    return ctx.body = {
      error: '参数验证失败'
    }
  }
  ctx.body = { success: '验证成功' };
};

exports.checkParams = async ctx => {
  ctx.checkParams({
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    }
  })
  if (ctx.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
    return ctx.body = {
      error: '参数验证失败'
    }
  }
  ctx.body = { success: '验证成功' };
};

exports.checkHeaders = async ctx => {
  ctx.checkHeaders('email','请输入正确的邮箱').isEmail()
  if (ctx.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
    return ctx.body = {
      error: '参数验证失败'
    }
  }
  ctx.body = { success: '验证成功' };
}

exports.check = async ctx => {
  ctx.check({
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    },
    'email2': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    }
  })
  if (ctx.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
    return ctx.body = {
      error: '参数验证失败'
    }
  }
  ctx.body = { success: '验证成功' };
}

exports.check = async ctx => {
  ctx.check({
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    },
    'email2': {
      notEmpty: true,
      isEmail: {
        errorMessage: '请输入正确的邮箱'
      }
    }
  })
  if (ctx.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', ctx.validationErrors());
    return ctx.body = {
      error: '参数验证失败'
    }
  }
  ctx.body = { success: '验证成功' };
}