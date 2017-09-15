const mongoose = require('mongoose')

/**
 * 文章内容
 */
const ContentSchema = new mongoose.Schema({
  // 标题
  title: { type: String, required: true },

  subtitle: { type: String },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentCategory' },

  tags: { type: String },

  keywords: { type: String },

  discription: { type: String },

  date: { type: Date, default: Date.now },

  updateDate: { type: Date, default: Date.now },

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

  isTop: { type: Number, enum: [0, 1], default: 0 },  // 是否推荐，默认不推荐 0为不推荐，1为推荐

  viewNum: { type: Number, default: 1 },

  comments: {},

  commentNum: { type: Number, default: 0 }, // 评论数

  likeNum: { type: Number, default: 0 }, // 喜欢数

  likeUserIds: String, // 喜欢该文章的用户ID集合

  from: { type: Number, enum: [0, 1], default: 0 }, // 来源 0为原创 1为转载
}, {
  collection: 'content',
  id: false,
})

module.exports = mongoose.model('Content', ContentSchema)
