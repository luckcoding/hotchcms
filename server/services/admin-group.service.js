const _ = require('lodash');
const adminGroupModel = require('../models/admin-group.model');
const adminUserModel = require('../models/admin-user.model');

const groupSchema = 'name description root authorities';

/**
 * 创建用户组
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, groupSchema.split(' '));
    if (data.root) return reject('不允许创建系统组');
    const adminGroup = await new adminGroupModel(data).save();
    resolve(adminGroup);
  } catch (e) {
    reject(e);
  };
});

/**
 * 更新用户组
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const data = _.pick(options, groupSchema.split(' '));
    if (data.root) return reject('不允许更新系统组');
    await adminGroupModel.update({ _id: _id }, data, { runValidators: true });
    resolve();
  } catch (e) {
    reject(e);
  };
});

/**
 * 删除用户组
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.remove = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const adminGroup = await adminGroupModel.findById(_id);
    if (_.isEmpty(adminGroup)) return reject('无此用户组');
    if (adminGroup.root) return reject('不允许删除系统组')
    await adminGroup.remove();
    await adminUserModel.update({ group: adminGroup._id }, { $unset: { group: true } });
    resolve();
  } catch (e) {
    reject(e);
  };
});

/**
 * 单个用户组
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const adminGroup = await adminGroupModel
      .findById(query)
      .select(groupSchema)
      .lean();
    adminGroup ? resolve(adminGroup) : reject('用户组不存在');
  } catch (e) {
    reject(e);
  };
});

/**
 * 用户组列表
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
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