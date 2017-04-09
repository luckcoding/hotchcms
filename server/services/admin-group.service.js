const _ = require('lodash');
const adminGroupModel = require('../models/admin-group.model');

const groupSchema = 'name description authorities';

exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, groupSchema.split(' '));
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
    const data = _.pick(options, groupSchema.split(' '));
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
    adminGroup ? await adminGroup.remove() : reject('无此用户组');
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const adminGroup = await adminGroupModel
      .findOne(query)
      .select(groupSchema)
      .lean();
    adminGroup ? resolve(adminGroup) : reject('用户组不存在');
  } catch (e) {
    reject(e);
  };
});

exports.list = options => new Promise(async (resolve, reject) => {
  try {
    const adminGroup = await adminGroupModel
      .find()
      .select(groupSchema)
      .lean();

    resolve(adminGroup);
  } catch (e) {
    reject(e);
  };
});