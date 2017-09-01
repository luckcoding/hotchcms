const mongoose = require('mongoose');
const cache = require('../lib/cache.lib');

const ThemeSchema = new mongoose.Schema({

  name: { type: String, required: true }, // 分类名

  alias: { type: String, default: 'default' }, // 主题别名【文件夹路径】

  version: { type: String }, // 版本

  cover: { type: String }, // 封面

  using : { type : Boolean, default : false }, // 是否被启用

  keywords: String, // 关键字

  description: String, // 描述

  author: { type: String, default: '' }, // 作者

  create: { type: Date, default: Date.now }, // 创建时间

  themes: [{ type: String , ref: 'ThemeTemplate' }], // 风格
  
}, {
  collection: 'theme',
  id: false
});



ThemeSchema.statics = {

  /**
   * 设置默认主题
   * @param {[type]} id [description]
   */
  async _set(id) {
    await this.update({}, { $set : { using:　false } }, { multi : true });
  },

  /**
   * 获取默认主题
   * @return {[type]} [description]
   */
  async _default() {
    const theme = await cache.get('SYSTEM_THEME');
    if (theme) return theme;
    return await this.findOne({ using: true }).populate('themes').lean();
  },
};

module.exports = mongoose.model('Theme', ThemeSchema);