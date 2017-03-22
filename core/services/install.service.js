const path = require('path');
const fs = require('fs');

const database = require('../lib/database.lib');
const optionsModel = require('../models/options.model');
const rolesModel = require('../models/roles.model');
const usersModel = require('../models/users.model');

/**
 * 缓存安装状态
 */
var hasInstall = false;

/**
 * 查询安装状态
 * @param {Function} callback
 */
exports.status = () => new Promise((resolve,reject) => {
  if (hasInstall) return resolve(true);

  fs.stat(path.join(__dirname, '../../install.lock'), (err, stat) => {
    if (err && err.code == 'ENOENT') {
      return resolve(false)
    } else if (err) {
      err.type = 'system';
      return reject(err);
    }

    if (stat.isFile()) {
      hasInstall = true;
      return resolve(true);
    } else {
      var err = {
        type: 'system',
        error: 'install.lock 非文件，请检查'
      }
      return reject(err)
    }
  })
})

/**
 * 安装
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.install = options => new Promise(async (resolve,reject) => {
  if (!options.databaseDate || !options.siteInfoDate || !options.userDate) {
    return reject({ type: 'system', error: '没有 data 传入' });
  };

  if (hasInstall) return reject({ type: 'system', error: '非法调用,cms已安装' });

  const { databaseDate, siteInfoDate, userDate } = options;

  try {
    // 初始化配置
    await database.init(databaseDate);

    // 链接数据库
    await database.connect();
    /**
     * 建表
     */
    let [siteInfo, roles] = await Promise.all([
      // 存储cms信息
      new optionsModel({ name: 'siteInfo', value: siteInfoDate }).save(),
      // 建立admin权限
      new rolesModel({
        name: '管理员', description: '系统内置', authorities: [100000]
      }).save()
    ])

    // 建立admin用户
    const user = await new usersModel({
      type: 'admin',
      email: userDate.email,
      nickname: userDate.nickname,
      password: userDate.password,
      role: roles._id
    }).save();
    // 建表成功后写入lock
    fs.writeFile('install.lock', true, function (err) {
      if (err) {
        err.type = 'system';
        return reject(err);
      }
    });
    resolve(user);
  } catch (e) {
    e.type = 'database';
    reject(e)
  }
})