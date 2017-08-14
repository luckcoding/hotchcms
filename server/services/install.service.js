const path = require('path');
const fs = require('fs');

const database = require('../lib/database.lib');
const optionsModel = require('../models/options.model');
const adminGroupModel = require('../models/admin-group.model');
const adminUserModel = require('../models/admin-user.model');

// 缓存安装状态
let hasInstall = false;

/**
 * 查询安装状态
 * @param  {Function} ) [description]
 * @return {[type]}     [description]
 */
exports.status = () => new Promise((resolve,reject) => {
  if (hasInstall) return resolve(true);

  // 读取锁文件
  fs.stat(path.join(__dirname, '../../install.lock'), (err, stat) => {

    if (err && err.code == 'ENOENT') return resolve(false);

    if (err) {
      err.type = 'system';
      return reject(err);
    }

    if (stat.isFile()) {
      hasInstall = true;
      return resolve(true);
    } else {
      reject(Throw('install.lock 非文件，请检查'));
    }
  });
});

/**
 * 安装
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.install = ({ databaseData, siteInfoData, adminUserData }) => new Promise(async (resolve,reject) => {
  if (!databaseData || !siteInfoData || !adminUserData) {
    return reject(Throw('缺少参数'));
  };

  if (hasInstall) return reject(Throw('非法调用,cms已安装'));

  try {
    // 初始化配置
    await database.init(databaseData);

    // 链接数据库
    await database.connect();
    /**
     * 建表
     */
    let [siteInfo, adminGroup] = await Promise.all([
      // 存储cms信息
      new optionsModel({ name: 'siteInfo', value: siteInfoData }).save(),
      // 建立root管理员用户组权限
      new adminGroupModel({
        name: '管理员', description: '系统内置', root: true
      }).save()
    ]);

    // 建立root管理员用户
    const { email, password } = adminUserData;
    await new adminUserModel({
      email,
      password,
      group: adminGroup._id
    }).save();
    // 建表成功后写入lock
    fs.writeFile('install.lock', true, err => {
      if (err) {
        err.type = 'system';
        return reject(err);
      }
    });
    resolve();
  } catch (e) {
    e.type = 'database';
    reject(e);
  }
})