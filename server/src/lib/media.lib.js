const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const mkdirp = require('mkdirp')
const crypto = require('crypto')
const moment = require('moment')
const { random } = require('./random.lib')

/**
 * 处理文件存储路径
 * 类型-时间
 * 方便遍历
 */
function folder(date, type) {
  return `${type}-${moment(date).format('YYYYMM')}`
}

/**
 * 解析、处理文件
 */
const parse = input => new Promise((resolve, reject) => {
  const suffix = input.type.split('/')[1]
  const md5sum = crypto.createHash('md5')
  const stream = fs.createReadStream(input.path)
  stream.on('data', chunk => md5sum.update(chunk))
  stream.on('end', () => resolve({
    prePath: input.path,
    path: `${folder(input.mtime, suffix)}/${random()}.${suffix}`, // 完整路径
    md5: md5sum.digest('hex'), // 文件md5值
    date: input.mtime,
    size: input.size,
  }))
  stream.on('error', error => reject(error))
})

/**
 * 文件上传
 */
const upload = schema => new Promise((resolve, reject) => {
  const filePath = `../../static/upload/${_.trimStart(schema.path, '/')}`
  const fileDir = filePath.substr(0, filePath.lastIndexOf('/'))
  mkdirp(path.join(__dirname, fileDir), (error) => {
    if (error) return reject(error)
    // 临时文件存储至相应目录
    fs.rename(schema.prePath, path.join(__dirname, filePath), (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
})

module.exports = { parse, upload }
