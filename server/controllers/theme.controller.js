const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
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
    file = file.toJSON();

    const zip = new AdmZip(file.path);
    const entry = zip.getEntry('default/info.json');
    if (!entry) throw Error('非法主题！')
    const info = JSON.parse(entry.getData());
    ctx.pipeDone(info);
  } catch (e) {
    ctx.pipeFail('9999', e);
  }
};

exports.list = async (ctx) => {
  const directory = path.join(__dirname, '../../publish/themes');
  fs.readdirSync(directory)
    .forEach(function (file) {
      const fullpath = path.join(directory, file);
      const stat = fs.statSync(fullpath);
      if (stat.isDirectory()) {
        fs.readFile(`${fullpath}/info.json`, async (err, file) => {
          if (err) {
            if (err.code === 'ENOENT') {
              err.message = 'database.config.json 文件不存在';
            }
            return reject(err);
          };
          console.log(JSON.parse(file))
        });
      }
    })
  ctx.pipeDone();
};