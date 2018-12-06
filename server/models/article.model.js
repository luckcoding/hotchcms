const mongoose = require('mongoose')
const shortid = require('shortid')

/**
 * 文章内容
 */
const ArticleSchema = new mongoose.Schema({

  _id: { type: String, default: shortid.generate }, // 自定义ID

  title: { type: String }, // 标题

  subTitle: { type: String }, // 概述

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // 类别

  cover: { type: String }, // 封面

  tags: [{ type: String }], // 标签

  content: { type: String }, // 内容，存储 html 字符串，不再存储json格式

  author: { type: mongoose.Schema.Types.ObjectId }, // 作者，如果是系统用户

  authorName: { type: String }, // 作者，非系统用户

  isTop: { type: Boolean, default: false }, // 是否置顶

  viewNum: { type: Number, default: 0 }, // 浏览数量

  comments: {}, // 评论

  commentNum: { type: Number, default: 0 }, // 评论数

  likeNum: { type: Number, default: 0 }, // 喜欢数

  likeUserIds: String, // 喜欢该文章的用户ID集合

  original: { type: Boolean, default: true }, // 是否原创 0为原创 1为转载

  from: { type: String }, // 原地址

  status: { type: Number, enum: [0, 1, 2], default: 0 }, // 0:草稿 1:上线 2:下线 9:回收站

  createDate: { type: Date, default: Date.now }, // 创建时间

  updateDate: { type: Date, default: Date.now }, // 最后更新时间
}, {
  collection: 'content',
})

module.exports = mongoose.model('Article', ArticleSchema)
