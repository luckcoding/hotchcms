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
 * @param {Object} options
 *        {String} options.host
 *        {String} options.database
 *        {Number} options.port
 *        {String} options.user
 *        {String} options.pass
 * @param {Function} callback
 */
exports.test = options => new Promise((resolve, reject) => {
  const db = mongoose.createConnection();
  db.open(options.host, options.db, options.port, {
    // user: options.user,
    // pass: options.pass
  }, error => {
    if (error) {
      error.type = 'system';
      reject(error);
    } else {
      // 关闭成功再返回
      db.close();
      resolve(true);
    };
  });
});


/**
 * 初始化数据库配置
 * @param {Object} options
 *        {String} options.host
 *        {String} options.database
 *        {Number} options.port
 *        {String} options.user
 *        {String} options.pass
 * @param {Function} callback
 */
exports.init = options => new Promise((resolve, reject) => {
  fs.writeFile(path.join(__dirname,'../../config/database.config.json'), JSON.stringify(options, null, 2), function (error){
    if (error) {
      error.type = 'system';
      return reject(error);
    }
    resolve(true);
  });
});

// /**
//  * 获取数据库配置
//  * @return {[type]} [description]
//  */
// function getConfig() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, '../config/database.config.json'), (error, file) => {
//       if (error && error.code === 'ENOENT') {
//         return reject({ type: 'system', error: 'database.config.json 文件不存在' })
//       };
//       if (error) {
//         error.type = 'system';
//         return reject(error);
//       };
//       resolve(JSON.parse(file));
//     })
//   });
// };

// /**
//  * 连接数据库
//  * @param  {[type]} options [description]
//  * @return {[type]}         [description]
//  */
// exports.connect = function (options) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const config = options || await getConfig();
//       mongoose.Promise = global.Promise;
//       await mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}`, {
//         user: config.user,
//         pass: config.pass
//       });
//       resolve()
//     } catch (e) {
//       e.type = 'database';
//       return reject(e);
//     }
//   });
// };

/**
 * 链接数据库
 * @param  {Function} ) [description]
 * @return {[type]}     [description]
 */
exports.connect = () => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../../config/database.config.json'), async (error, file) => {
    if (error && error.code === 'ENOENT') {
      return reject({ type: 'system', error: 'database.config.json 文件不存在' })
    };
    if (error) {
      error.type = 'system';
      return reject(error);
    };
    const config = JSON.parse(file);
    try {
      await mongoose.connect(`mongodb://${config.host}:${config.port}/${config.db}`, {
        // user: config.user,
        // pass: config.pass
      });
      resolve()
    } catch (e) {
      e.type = 'database';
      return reject(e);
    }
  });
});
