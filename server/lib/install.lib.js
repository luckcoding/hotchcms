const path = require('path')
const fs = require('fs')
const redis = require('./redis.lib')
const mongodb = require('./mongodb.lib')
const {
  Options,
  AdminGroup,
  AdminUser,
} = require('../models')

/**
 * 查询安装状态
 */
exports.status = () => new Promise((resolve, reject) => {
  // 读取锁文件
  fs.stat(path.join(__dirname, '../install.lock'), (err, stat) => {
    if (err && err.code === 'ENOENT') return resolve(false) // 未安装

    if (err) return reject(err) // 出错

    if (stat.isFile()) {
      resolve(true)
    } else {
      reject(Throw('install.lock 非文件，请检查'))
    }
  })
})

/**
 * 安装
 */
exports.install = ({ databaseData, redisData, adminUserData }) => new Promise(async (resolve, reject) => {
  if (!databaseData || !redisData || !adminUserData) {
    return reject(Throw('缺少参数'))
  }

  try {
    // 检查安装状态
    const status = await exports.status()
    if (status) return reject(Throw('非法调用,cms已安装'))

    // 初始化配置
    await mongodb.init(databaseData)
    await redis.init(redisData)

    // 链接数据库
    await mongodb.connect()
    await redis.connect()

    // 创建root用户组
    const adminGroup = await new AdminGroup({
      name: '管理员[系统]', description: '系统内置', gradation: 100,
    }).save()

    // 建立root用户
    await new AdminUser({
      email: adminUserData.email,
      mobile: adminUserData.mobile,
      password: adminUserData.password,
      group: adminGroup._id,
    }).save()

    // 建表成功后写入lock
    fs.writeFile('install.lock', true, err => (err ? reject(err) : resolve()))
  } catch (e) {
    e.type = 'database'
    reject(e)
  }
})