const _ = require('lodash');
const adminUserModel = require('../models/admin-user.model');

const userSchema = 'mobile email password nickname avatar create group';
const groupSchema = 'name description authorities';
/**
 * 创建
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, userSchema.split(' '));
    // const query = _.pick(options, ['_id', 'email']);
    // const adminUser = await adminUserModel.findOne(query);
    // console.log(adminUser)
    // if (adminUser) throw '已存在用户';
    await new adminUserModel(data).save();
    resolve();
  } catch (e) {
    reject({ type: 'database', error: e });
  };
});

/**
 * 更新
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const _id = options._id;
    if (!_id) throw Error('缺少_id');
    const data = _.pick(options, userSchema.split(' '));
    await adminUserModel.update({ _id: _id }, data, { runValidators: true });
    resolve();
  } catch (e) {
    reject(e);
  };
});

/**
 * 删除
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
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

/**
 * 查询单个
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.one = options => new Promise(async (resolve, reject) => {
  try {
    const query = _.pick(options, ['_id', 'email']);
    if (_.isEmpty(query)) throw Error('缺少查询条件');
    const adminUser = await adminUserModel
      .findOne(query)
      .select(userSchema)
      .populate('group', groupSchema)
      .lean();

    resolve(adminUser);
  } catch (e) {
    reject(e);
  };
});

exports.list = options => new Promise(async (resolve, reject) => {
  try {
    const adminUser = await adminUserModel
      .find()
      .select(userSchema)
      .populate('group', groupSchema)
      .lean();

    resolve(adminUser);
  } catch (e) {
    reject(e);
  };
});