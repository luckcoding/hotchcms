const contentService = require('../services/content.service');

exports.create = async ctx => {
  ctx.checkBody({
    'title': {
      notEmpty: {
        options: [true],
        errorMessage: 'title 不能为空'
      },
      isString: { errorMessage: 'avatar 需为字符串' },
    },
  });

  if (ctx.validationErrors()) return null;

  try {
    await contentService.create(ctx.request.body)
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};