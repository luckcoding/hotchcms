const mongoose = require('mongoose');

/**
 * 文章分类
 */
const categoriesSchema = new mongoose.Schema({
  // 父级
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },

  // 分类名
  name: { type: String, required: true },

  // 目录
  path: { type: String, unique: true, trim: true, lowercase: true,
    match: /^[A-z0-9\-\_\/]+$/, sparse: true
  },

  // 是否在导航中显示
  isShow: { type: Boolean, default: true },

  // 排序
  sort: { type: Number, default: 0 },

  // 内容模型
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Models' },

  // 视图
  views: { layout: String, channel: String, column: String, content: String,
    page: String
  },

  // 关键字
  keywords: String,

  // 描述
  description: String,
  
}, {
  collection: 'categories',
  id: false
});

module.exports = mongoose.model('Categories', categoriesSchema);