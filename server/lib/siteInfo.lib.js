const fs = require('fs');
const path = require('path');

const configFile = () => path.join(__dirname,'../config/siteInfo.config.json');

// 网站基本信息
module.exports = {
  // 获取
  get: options => new Promise((resolve, reject) => {
    if (err) {
      if (err.code === 'ENOENT') {
        err.message = 'siteInfo.config.json 文件不存在';
      }
      return reject(error);
    };

    return resolve(JSON.parse(file));
  }),

  // 存储
  save: options => new Promise((resolve, reject) => {
    fs.writeFile(configFile(), JSON.stringify(options, null, 2), err => {
      err ? reject(err) : resolve(true);
    });
  }),

};

