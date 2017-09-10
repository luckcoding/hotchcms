const path = require('path');
const fs = require('fs');
const redis = require('../lib/redis.lib');
const database = require('../lib/database.lib');
const Options = require('../models/options.model');
const AdminGroup = require('../models/admin-group.model');
const AdminUser = require('../models/admin-user.model');

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

    if (err && err.code == 'ENOENT') return resolve(false); // 未安装

    if (err) return reject(err); // 出错

    if (stat.isFile()) {
      hasInstall = true;
      resolve(true);
    } else {
      reject(Throw('install.lock 非文件，请检查'));
    }
  });
});

/**
 * 安装
 * @param  {[type]} { siteInfoData, adminUserData }) [description]
 * @return {[type]}    [description]
 */
exports.install = ({ databaseData, redisData, siteInfoData, adminUserData }) => new Promise(async (resolve,reject) => {
  if (!databaseData || !redisData || !siteInfoData || !adminUserData) {
    return reject(Throw('缺少参数'));
  };

  try {
    // 检查安装状态
    const status = await exports.status();
    if (status) return reject(Throw('非法调用,cms已安装'));

    // 初始化配置
    await database.init(databaseData);
    await redis.init(redisData);

    // 链接数据库
    await database.connect();
    await redis.connect();

    /**
     * 建表
     */
    let [siteInfo, adminGroup] = await Promise.all([
      // 存储cms信息
      new Options({ name: 'siteInfo', value: siteInfoData }).save(),
      // 建立root管理员用户组权限
      new AdminGroup({
        name: '管理员[系统]', description: '系统内置', gradation: 100
      }).save()
    ]);

    // 建立root管理员用户
    await new AdminUser({
      email: adminUserData.email,
      password: adminUserData.password,
      group: adminGroup._id
    }).save();

    // 建表成功后写入lock
    fs.writeFile('install.lock', true, err => err ? reject(err) : resolve());
  } catch (e) {
    e.type = 'database';
    reject(e);
  }
})