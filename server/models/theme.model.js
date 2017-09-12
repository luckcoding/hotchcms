const mongoose = require('mongoose');
const _ = require('lodash');
const cache = require('../lib/cache.lib');

const ThemeTemplate = require('./theme-template.model');

const ThemeSchema = new mongoose.Schema({

  name: { type: String, required: true }, // 分类名

  alias: { type: String, default: 'default', unique: true }, // 主题别名【文件夹路径】

  version: { type: String }, // 版本

  cover: { type: String }, // 封面

  using : { type : Boolean, default : false }, // 是否被启用

  keywords: String, // 关键字

  description: String, // 描述

  author: { type: String, default: '' }, // 作者

  create: { type: Date, default: Date.now }, // 创建时间

  template: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ThemeTemplate' }], // 模版
  
}, {
  collection: 'theme',
  id: false
});



ThemeSchema.statics = {
  async _install(options) {
    const call = await ThemeTemplate.create(options.template);
    options.template = _.map(call, '_id');
    return this.create(options);
  },

  /**
   * 设置默认主题
   * @param {[type]} _id [description]
   */
  async _set(_id) {
    await this.update({}, { $set : { using:　false } }, { multi : true });
    return this.findByIdAndUpdate({ _id }, { $set: { using:true } }, { runValidators: true });
  },

  /**
   * 获取默认主题
   * @return {[type]} [description]
   */
  async _default() {
    const theme = await cache.get('SYSTEM_THEME');
    if (theme) return theme;
    const call = await this.findOne({ using: true }).populate('themes').lean();
    await cache.set('SYSTEM_THEME', call, 1000 * 60 * 60 * 24);
    return call;
  },

  _list() {
    return this.find({}).populate('template', {}).lean();
  }
};

module.exports = mongoose.model('Theme', ThemeSchema);