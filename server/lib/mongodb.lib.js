const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const configFile = () => path.join(__dirname, '../config/mongodb.config.json')

/**
 * 使用 bluebird 诺言库
 * @type {[type]}
 */
mongoose.Promise = global.Promise

/**
 * 测试数据库连接
 */
exports.test = (options = {}) => new Promise((resolve, reject) => {
  const DB = mongoose.createConnection()
  const { host, port, db, user, pass } = options
  DB.open(host, db, port, { user, pass }, (err) => {
    if (err) {
      reject(err)
    } else {
      // 关闭后返回
      DB.close()
      resolve()
    }
  })
})


/**
 * 初始化数据库配置
 */
exports.init = options => new Promise((resolve, reject) => {
  fs.writeFile(configFile(), JSON.stringify(options, null, 2), (err) => {
    err ? reject(err) : resolve(true)
  })
})

/**
 * 链接数据库
 */
exports.connect = () => new Promise((resolve, reject) => {
  fs.readFile(configFile(), async (err, file) => {
    if (err) {
      if (err.code === 'ENOENT') {
        err.message = 'database.config.json 文件不存在'
      }
      return reject(err)
    }

    try {
      const { host, port, db, user, pass } = JSON.parse(file)
      await mongoose.connect(`mongodb://${host}:${port}/${db}`, { user, pass })
      resolve()
    } catch (e) {
      reject(e)
    }
  })
})
