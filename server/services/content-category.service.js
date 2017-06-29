const _ = require('lodash');
const contentCategoryModel = require('../models/content-category.model');

const categorySchema = 'uid name path state sort keywords description';

exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, categorySchema.split(' '));
    const contentCategory = await new contentCategoryModel(data).save();
    resolve(contentCategory);
  } catch (e) {
    reject(e);
  };
});

exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const data = _.pick(options, categorySchema.split(' '));
    await contentCategoryModel.update({ _id: _id }, data, { runValidators: true });
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.remove = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const contentCategory = await contentCategoryModel.findById(_id);
    contentCategory ? await contentCategory.remove() : reject('无此分类');
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const contentCategory = await contentCategoryModel
      .findOne(query)
      .select(categorySchema)
      .lean();
    contentCategory ? resolve(contentCategory) : reject('分类不存在');
  } catch (e) {
    reject(e);
  };
});

exports.list = options => new Promise(async (resolve, reject) => {
  try {
    const contentCategory = await contentCategoryModel
      .find()
      .select(categorySchema)
      .lean();

    _.isEmpty(contentCategory) ? reject('无数据') : resolve(contentCategory);
  } catch (e) {
    reject(e);
  };
});