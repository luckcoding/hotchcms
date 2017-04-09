const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

/**
 * 文章分类
 */
const ContentCategorySchema = new mongoose.Schema({
  // 父级
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentCategory' },

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

  // 内容模型
  // model: { type: mongoose.Schema.Types.ObjectId, ref: 'Models' },

  // 关键字
  keywords: String,

  // 描述
  description: String,
  
}, {
  collection: 'contentCategory',
  id: false
});

ContentCategorySchema.plugin(unique);

module.exports = mongoose.model('ContentCategory', ContentCategorySchema);