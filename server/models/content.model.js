const mongoose = require('mongoose')

/**
 * 文章内容
 */
const ContentSchema = new mongoose.Schema({

  title: { type: String }, // 标题

  subtitle: { type: String }, // 概述

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // 类别

  cover: { type: String }, // 封面

  tags: [{ type: String }], // 标签

  content: { type: String }, // 内容，存储 html 字符串，不再存储json格式

  date: { type: Date, default: Date.now }, // 创建时间

  updateDate: { type: Date, default: Date.now }, // 最后更新时间

  author: { type: mongoose.Schema.Types.ObjectId }, // 作者

  isTop: { type: Boolean, default: false }, // 是否置顶

  viewNum: { type: Number, default: 0 }, // 浏览数量

  comments: {}, // 评论

  commentNum: { type: Number, default: 0 }, // 评论数

  likeNum: { type: Number, default: 0 }, // 喜欢数

  likeUserIds: String, // 喜欢该文章的用户ID集合

  // 是否原创 0为原创 1为转载
  original: { type: Boolean, default: true },

  from: { type: String }, // 原地址

  // 0为草稿 1为上线 2为下线
  status: { type: Number, enum: [0, 1, 2], default: 0 },

}, {
  collection: 'content',
  id: false,
})


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

  async _remove (input) {
    const _in = Array.isArray(input) ? { $in: input } : input
    return this.remove({ _id: _in })
  },

  _count () {
    return this.count({})
  },
}

module.exports = mongoose.model('Content', ContentSchema)
