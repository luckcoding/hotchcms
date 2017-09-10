const fs = require('fs');
const { SiteInfo } = require('../services/site.service');

exports.get = async ctx => {
  try {
    const call = await SiteInfo().get();
    ctx.pipeDone(call);
  } catch (e) {
    ctx.pipeFail(e);
  };
};

exports.save = async ctx => {
  ctx.checkBody({
    'title': {
      optional: true,
      isString: { errorMessage: 'title 需为字符串' },
    },
    'keywords': {
      optional: true,
      inArray: {
        options: ['isString'],
        errorMessage: 'keywords 内需为 string'
      },
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'title 需为字符串' },
    },
  });

  if (ctx.validationErrors()) return null;
  try {
    await SiteInfo().set(ctx.request.body);
    ctx.pipeDone();
  } catch (e) {
    ctx.pipeFail(e);
  };
};