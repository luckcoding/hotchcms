const _ = require('lodash');
const adminGroupModel = require('../models/admin-group.model');

const schema = 'name description root authorities';

exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, schema.split(' '));
    const adminGroup = await new adminGroupModel(data).save();
    resolve(adminGroup);
  } catch (e) {
    reject(e);
  };
});

exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const data = _.pick(options, schema.split(' '));
    await adminGroupModel.update({ _id: _id }, data, { runValidators: true });
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.remove = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const adminGroup = await adminGroupModel.findById(_id);
    await adminGroup.remove();
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id', 'name']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const adminGroup = await adminGroupModel
      .findOne(query)
      .select(schema)
      .lean();
    // adminGroup ? resolve(adminGroup) : reject();
    resolve(adminGroup);
  } catch (e) {
    reject(e);
  };
});