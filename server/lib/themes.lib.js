const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const AdmZip = require('adm-zip');

exports.install = file => new Promise((resolve, reject) => {
  if (!file) throw Error('主题为空');
  file = file.toJSON();
  if (file.type !== 'application/zip') throw Error('仅支持zip');
  const name = file.name.split('.')[0];
  const zip = new AdmZip(file.path);
  const entry = zip.getEntry(`${name}/info.json`);
  if (!entry) throw Error('非法主题');
  const info = JSON.parse(entry.getData());
  if (!info.alias) throw Error('非法主题配置');
  const themePath = path.join(__dirname, `../../publish/themes/${info.alias}`);
  fs.exists(themePath, exists => {
    if (exists) return reject('已安装主题');
    zip.extractAllTo(path.join(__dirname,'../../publish/themes/'), true);
    resolve(info);
  })
});
