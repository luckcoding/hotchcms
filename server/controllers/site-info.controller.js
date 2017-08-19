const fs = require('fs');
const siteInfoService = require('../services/site-info.service');

exports.get = async ctx => {
  try {
    const siteInfo = await siteInfoService.get();
    ctx.pipeDone(siteInfo);
  } catch (e) {
    ctx.pipeFail(e);
  };
};