const _ = require('lodash');
const adminUserModel = require('../models/admin-user.model');

const schema = 'mobile email password nickname avatar create group';

exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, schema.split(' '));
    await new adminUserModel(data).save();
    resolve();
  } catch (e) {
    console.log(e)
    reject(e);
  };
});

exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const data = _.pick(options, schema.split(' '));
    await adminUserModel.update({ _id: _id }, data, { runValidators: true });
    adminUser ? resolve() : reject();
  } catch (e) {
    reject(e);
  };
});

exports.remove = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const adminUser = await adminUserModel.findById(_id);
    await adminUser.remove();
    resolve();
  } catch (e) {
    reject(e);
  };
});

exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id', 'email']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const adminUser = await adminUserModel
      .findOne(query)
      .select(schema)
      .populate('group', 'name description authorities')
      .lean();
    // adminUser ? resolve(adminUser) : reject();
    resolve(adminUser);
  } catch (e) {
    reject(e);
  };
});