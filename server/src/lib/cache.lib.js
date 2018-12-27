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
  let setValue = value
  if (lodash.isObject(value) || Array.isArray(value)) {
    setValue = JSON.stringify(value)
  }
  try {
    const client = await redis.connect()
    if (!maxAge) {
      client.set(key, setValue, err => (err ? reject(err) : resolve()))
    } else {
      client.set(key, setValue, 'EX', maxAge, err => (err ? reject(err) : resolve())) // 秒为单位
    }
  } catch (e) {
    reject(e)
  }
})

exports.del = key => new Promise(async (resolve, reject) => {
  const client = await redis.connect()
  client.del(key, err => (err ? reject(err) : resolve()))
})
