const _ = require('lodash');
const mongoose = require('mongoose');
const cache = require('../lib/cache.lib');
const { arrayToTree } = require('../utils');

/**
 * 文章分类
 */
const CategorySchema = new mongoose.Schema({
  // 父级
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // 首页
  isHome: { type: Boolean, default: false },

  // 分类名
  name: { type: String, required: true },

  // 目录
  path: { type: String, unique: true, trim: true, lowercase: true,
    match: /^[A-z0-9\-\_\/]+$/, sparse: true, minlength: 2
  },

  // 是否在导航中显示
  state: { type: Boolean, default: true },

  // 排序
  sort: { type: Number, default: 0 },

  // 内容模板
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ThemeTemplate' },

  // 关键字
  keywords: String,

  // 描述
  description: String,
  
}, {
  collection: 'category',
  id: false
});

CategorySchema.statics = {
  async _list() {
    const categories = cache.get('categories');
    if (categories) return _.cloneDeep(categories);
    const call = await this.find({})
      .select('uid isHome name path state sort template keywords description')
      .sort('sort')
      .populate('template')
      .lean();
    cache.set('categories', call, 1000 * 60 * 60 * 24);
    return call;
  },

  async _save({ _id, input = {} }) {
    if (_.isEmpty(input)) throw Error('options error');
    if (input.isHome) {
      const list = await this.find({ isHome: true });
      for (let value of list) {
        await value.update({ isHome: false });
      }
    }
    if (_id) {
      await this.findByIdAndUpdate(_id, input, { runValidators: true })
    } else {
      await this.create(input);
    }
    return cache.del('categories');
  },

  async _remove(_id) {
    await this.remove({ _id });
    await this.update({ _id }, { $unset: { uid: true } });
    return cache.del('categories');
  },

  async _tree() {
    const list = await this._list();
    const tree = arrayToTree(list, '_id', 'uid');
    return tree;
  },

  async _navigation() {
    const list = await this._list();
    const navigation = arrayToTree(list.filter(i => i.state), '_id', 'uid');
    return navigation;
  }
}

module.exports = mongoose.model('Category', CategorySchema);