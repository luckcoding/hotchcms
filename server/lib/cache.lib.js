const lodash = require('lodash')
const redis = require('./redis.lib')

exports.get = key => new Promise(async (resolve, reject) => {
  const client = await redis.connect()
  client.get(key, (err, data) => {
    if (err) return reject(err)
    try {
      return resolve(JSON.parse(data))
    } catch (e) {
      return resolve(data)
    }
  })
})

exports.set = (key, value, maxAge) => new Promise(async (resolve, reject) => {
  if (lodash.isObject(value) || Array.isArray(value)) {
    value = JSON.stringify(value)
  }
  try {
    const client = await redis.connect()
    if (!maxAge) {
      client.set(key, value, err => (err ? reject(err) : resolve()))
    } else {
      client.set(key, value, 'EX', maxAge, (err) => {
        return err ? reject(err) : resolve()
      }) // 秒为单位
    }
  } catch (e) {
    reject(e)
  }
})

exports.del = key => new Promise(async (resolve, reject) => {
  const client = await redis.connect()
  client.del(key, err => (err ? reject(err) : resolve()))
})
