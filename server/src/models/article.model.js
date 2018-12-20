const mongoose = require('mongoose')
const shortid = require('shortid')

/**
 * 文章内容
 */
const ArticleSchema = new mongoose.Schema({

  _id: { type: String, default: shortid.generate }, // 自定义ID

  title: { type: String }, // 标题

  overview: { type: String }, // 概述

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // 类别

  cover: { type: String }, // 封面

  tags: [{ type: String }], // 标签

  content: { type: String }, // 内容，存储 html 字符串，不再存储json格式

  sourceType: { type: Number, enum: [0, 1, 2], default: 0 }, // 来源类型 0: 转载, 1: 编辑(adminUser), 2: 用户(User)

  author: { type: mongoose.Schema.Types.ObjectId }, // 作者ID, 系统内部作者才有

  originalAuthor: { type: String }, // 原作者名字，用于转载等场景

  originalUrl: { type: String }, // 转载地址

  isTop: { type: Boolean, default: false }, // 是否置顶

  viewNum: { type: Number, default: 0 }, // 浏览数量

  commentId: { type: String }, // 评论ID

  commentNum: { type: Number, default: 0 }, // 评论数

  likes: [String], // 喜欢该文章的用户ID集合

  status: { type: Number, enum: [0, 1, 2, 9], default: 0 }, // 0:草稿 1:上线 2:下线 9:回收站

  createDate: { type: Date, default: Date.now }, // 创建时间

  updateDate: { type: Date, default: Date.now }, // 最后更新时间
}, {
  collection: 'article',
})

module.exports = mongoose.model('Article', ArticleSchema)
