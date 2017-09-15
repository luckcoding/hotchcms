const mongoose = require('mongoose')

/**
 * 种子模型
 */
const torrentsSchema = new mongoose.Schema({
  /**
   * 类别
   * 未分类资源:resource
   * 音乐:music 影视:film 图片:picture 文档:document
   */
  type: { type: String, enum: ['resource', 'music', 'film', 'picture', 'document'], required: true },

  // 名称
  title: { type: String, required: true },

  // 种子
  torrent: { type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  },

  // 标签
  tags: [String],

  // 描述
  description: { type: String },

  // 下载次数
  downloads: { type: Number, default: 0 },

  // 查看次数
  views: { type: Number, default: 0 },

  // 发布者
  publisher: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    name: { type: String },
  },

  // 评分
  grade: { type: Number, min: 0, max: 100 },

  // 产看权限
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roles',
  },

  // 评论
  // comment: {},

  // 参与维护
  // partake: {}

  // 注册信息
  create: {
    // 时间
    date: { type: Date, default: Date.now },
    // 地点
    address: { type: String, trim: true },
    // IP
    ip: { type: String, trim: true, match: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
    // 平台
    platform: { type: String, trim: true },
    // 其他
    collection: { type: Object },
  },

}, {
  collection: 'torrents',
  id: false,
})

/**
 * 发布为模型
 */
// export default mongoose.model('Torrents', torrentsSchema);

module.exports = mongoose.model('Torrents', torrentsSchema)
