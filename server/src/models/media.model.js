const mongoose = require('mongoose')

/**
 * 媒体模型
 */
const MediaSchema = new mongoose.Schema({

  path: { type: String, required: true }, // 完整路径

  md5: { type: String, required: true }, // md5

  date: { type: Date, default: Date.now }, // 上传日期

  size: { type: Number, required: true }, // 媒体大小

  type: { type: String, enum: ['image', 'zip'], required: true }, // 类型

  alias: { type: String }, // 别名

  quotes: mongoose.Schema.Types.ObjectId, // 来源归属
}, {
  collection: 'media',
  id: false,
})

module.exports = mongoose.model('Media', MediaSchema)
