const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({

  name: { type: String, required: true }, // 分类名

  alias: { type: String, default: 'default' }, // 主题别名【文件夹路径】

  version: { type: String }, // 版本

  cover: { type: String }, // 封面

  using : { type : Boolean, default : false }, // 是否被启用

  keywords: String, // 关键字

  description: String, // 描述

  author: { type: String, default: '' }, // 作者

  create: { type: Date, default: Date.now() }, // 创建时间
  
}, {
  collection: 'theme',
  id: false
});

module.exports = mongoose.model('Theme', ThemeSchema);