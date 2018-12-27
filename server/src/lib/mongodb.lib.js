const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const configFile = () => path.join(__dirname, '../config/mongodb.config')

/**
 * 使用 bluebird 诺言库
 */
mongoose.Promise = global.Promise

/**
 * 测试数据库连接
 */
exports.test = (options = {}) => new Promise((resolve, reject) => {
  const DB = mongoose.createConnection()
  const {
    host, port, db, user, pass,
  } = options

  DB.openUri(`mongodb://${host}:${port}/${db}`, {
    user,
    pass,
    promiseLibrary: global.Promise,
  })
    .once('open', async () => {
      await DB.close()
      resolve()
    })
    .on('error', err => reject(err))
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
    if (err) return reject(err)

    try {
      const {
        host, port, db, user = '', pass = '',
      } = JSON.parse(file)

      await mongoose.connect(
        `mongodb://${host}:${port}/${db}`,
        {
          user,
          pass,
        },
      )

      resolve()
    } catch (e) {
      reject(e)
    }
  })
})
