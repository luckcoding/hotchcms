const mongoose = require('mongoose');

/**
 * 文章分类
 */
const CategorySchema = new mongoose.Schema({
  // 父级
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // 首页
  index: { type: Boolean, default: false },

  // 分类名
  name: { type: String, required: true },

  // 目录
  path: { type: String, unique: true, trim: true, lowercase: true,
    match: /^[A-z0-9\-\_\/]+$/, sparse: true
  },

  // 是否在导航中显示
  state: { type: Boolean, default: true },

  // 排序
  sort: { type: Number, default: 0 },

  // 内容模板
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ThemeTemplate' },

  // 关键字
  keywords: String,

  // 描述
  description: String,
  
}, {
  collection: 'category',
  id: false
});

module.exports = mongoose.model('Category', CategorySchema);