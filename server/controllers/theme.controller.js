const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const ThemeLib = require('../lib/themes.lib');
const Theme = require('../models/theme.model');
const ThemeTemplate = require('../models/theme-template.model');

exports.install = async ctx => {
  ctx.checkHeaders({
    'content-type': {
      notEmpty: {
        options: [true],
        errorMessage: 'content-type 不能为空'
      },
      matches: {
        options: [/multipart\/form-data/i],
        errorMessage: '数据需为文件格式'
      }
    },
  });

  if (ctx.validationErrors()) return null;

  try {
    let { file } = ctx.request.body.files;
    const info = await ThemeLib(file);
    ctx.pipeDone(info);
  } catch (e) {
    ctx.pipeFail(e, '9999');
  }
};

exports.list = async (ctx) => {
  try {
    const call = await Theme._list();
    ctx.pipeDone(call)
  } catch (e) {
    ctx.pipeFail(e, '9999');
  }
};