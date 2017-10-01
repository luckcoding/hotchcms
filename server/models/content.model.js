const mongoose = require('mongoose')
const Validator = require('../lib/mongoose-validator-schema')

/**
 * 文章内容
 */
const ContentSchema = new mongoose.Schema({
  // 标题
  title: { type: String, required: true },

  // 概述
  subtitle: { type: String },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // 封面
  cover: { type: String },

  tags: [{ type: String }],

  keywords: [{ type: String }], // seo

  discription: { type: String }, // seo

  content: String, // 内容

  date: { type: Date, default: Date.now },

  updateDate: { type: Date, default: Date.now },

  author: { type: mongoose.Schema.Types.ObjectId },

  isTop: { type: Number, enum: [0, 1], default: 0 },  // 是否推荐，默认不推荐 0为不推荐，1为推荐

  // 浏览数量
  viewNum: { type: Number, default: 1 },

  comments: {},

  commentNum: { type: Number, default: 0 }, // 评论数

  likeNum: { type: Number, default: 0 }, // 喜欢数

  likeUserIds: String, // 喜欢该文章的用户ID集合

  from: { type: Number, enum: [0, 1], default: 0 }, // 来源 0为原创 1为转载

  status: { type: Number, enum: [0, 1, 2], default: 0 }, // 0为草稿 1为上线 2为下线
}, {
  collection: 'content',
  id: false,
})

ContentSchema.plugin(Validator)

ContentSchema.statics = {
  _one (_id) {
    return this.findById(_id).select({})
  },

  async _list ({ page = 1, size = 20, ...query }) {
    if (query.title) query.title = new RegExp(query.title, 'i')
    const count = await this.count(query)
    const list = await this.find(query)
      .skip((page - 1) * size)
      .limit(size)
      .select({})
      .lean()
    return { count, page, size, list }
  },

  _count () {
    return this.count({})
  },
}

module.exports = mongoose.model('Content', ContentSchema)
