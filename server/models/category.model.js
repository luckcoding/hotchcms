const _ = require('lodash');
const mongoose = require('mongoose');
const cache = require('../lib/cache.lib');
const { arrayToTree } = require('../utils');

const Validator = require('../lib/mongoose-validator-schema');

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
    match: /^[A-z]+$/, sparse: true, minlength: 4
  },

  // 是否在导航中显示
  state: { type: Boolean, default: true },

  // 排序
  sort: { type: Number, default: 0, unique: true },

  // 内容模板
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ThemeTemplate' },

  // 关键字
  keywords: [ { type: String } ],

  // 描述
  description: String,

  // 创建时间
  createDate: { type: Date, default: Date.now },
}, {
  collection: 'category',
  id: false
});

CategorySchema.plugin(Validator);

CategorySchema.statics = {
  async _list() {
    const categories = await cache.get('SYSTEM_CATEGORIES');
    if (categories) return _.cloneDeep(categories);
    const call = await this.find({})
      .select('uid isHome name path state sort template keywords description')
      .sort('sort')
      .populate('template')
      .lean();
    await cache.set('SYSTEM_CATEGORIES', call, 1000 * 60 * 60 * 24);
    return call;
  },

  async _path() {
    const list = await this._list();
    const output = [];
    _.forEach(list, item => output.push(item.path));
    return output;
  },

  async _save({ _id, input = {} }) {
    if (input.isHome) {
      await this.update({ isHome: true }, { $set: { isHome :　false } }, { multi: true });
    }
    if (_id) {
      if (input.uid) {
        const call = await this.find({ uid: _id });
        const child = [];
        _.forEach(call, i => child.push(String(i._id)));
        if (_.includes(child, String(input.uid))) throw Error('不能被包含');
        await this.findByIdAndUpdate({ _id }, { $set: input }, { runValidators: true });
      } else {
        await this.findByIdAndUpdate({ _id }, { $set: input, $unset: { uid: true } }, { runValidators: true });
      }
    } else {
      await this.create(input);
    }
    return cache.del('SYSTEM_CATEGORIES');
  },

  async _remove(input) {
    const _in = _.isArray(input) ? { $in: input } : input;
    await this.remove({ _id: _in });
    await this.update({ _id: _in }, { $unset: { uid: true } });
    return cache.del('SYSTEM_CATEGORIES');
  },

  async _tree() {
    const list = await this._list();
    const tree = arrayToTree(list, '_id', 'uid');
    return tree;
  },

  async _navigation() {
    const list = await this._list();
    const navigation = list.filter(i => i.state);
    return navigation;
  }
}

module.exports = mongoose.model('Category', CategorySchema);