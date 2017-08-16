const mongoose = require('mongoose');


const ThemeTemplateSchema = new mongoose.Schema({

  name: { type: String, required: true }, // 分类名

  alias: { type: String, default: 'default', match: /^default-\d$/ }, // 类别小主题

  type: { type: String, enum: ['article'], default: 'article' }, // 主题所属

  default: { type: Boolean, default: false }, // 是否默认模版

  cover: { type: String }, // 封面

  author: { type: String , default: '' }, // 作者

  description: String, // 描述
  
}, {
  collection: 'themeTemplate',
  id: false
});

module.exports = mongoose.model('ThemeTemplate', ThemeTemplateSchema);