const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

/**
 * 使用 bluebird 诺言库
 * @type {[type]}
 */
mongoose.Promise = global.Promise;

/**
 * 测试数据库连接
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.test = options => new Promise((resolve, reject) => {
  const DB = mongoose.createConnection();
  const { host, port, db, user, pass } = options;
  DB.open(host, db, port, { user, pass }, error => {
    if (error) {
      error.type = 'system';
      reject(error);
    } else {
      // 关闭成功再返回
      DB.close();
      resolve(true);
    };
  });
});


/**
 * 初始化数据库配置
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.init = options => new Promise((resolve, reject) => {
  fs.writeFile(path.join(__dirname,'../config/database.config.json'), JSON.stringify(options, null, 2), error => {
    if (error) {
      error.type = 'system';
      reject(error);
    } else {
      resolve(true);
    }
  });
});

/**
 * 链接数据库
 * @param  {Function} ) [description]
 * @return {[type]}     [description]
 */
exports.connect = () => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../config/database.config.json'), async (error, file) => {
    if (error) {
      error.type = 'system';
      if (error.code === 'ENOENT') {
        error.message = 'database.config.json 文件不存在';
      }
      return reject(error);
    };

    try {
      const config = JSON.parse(file);
      await mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}`, {
        user: config.user,
        pass: config.pass
      });
      resolve()
    } catch (e) {
      e.type = 'database';
      return reject(e);
    }
  });
});
