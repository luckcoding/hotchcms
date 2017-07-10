const _ = require('lodash');
const adminUserModel = require('../models/admin-user.model');
const adminGroupModel = require('../models/admin-group.model');

const userSchema = 'mobile email password nickname avatar create group';
const groupSchema = 'name description root authorities';

/**
 * userSchema options
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const pick = options => {
  return _.pick(options, userSchema.split(' '));
};

/**
 * 判断是否是系统用户组
 * @param  {[type]} groupId [description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
const isRoot = async groupId => {
  if (!groupId) return Promise.resolve(false);
  const adminGroup = await adminGroupModel.findById({ _id: groupId }).select('root').lean();
  return adminGroup.root ? Promise.resolve(true) : Promise.reject(false);
};

/**
 * 创建
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = pick(options);
    const _root = await isRoot(data.group);
    if (_root) return reject({ type: 'system', error: '不能创建系统组用户' });
    await new adminUserModel(data).save();
    resolve();
  } catch (e) {
    reject({ type: 'database', error: e.message });
  };
});

/**
 * 更新
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.update = options => new Promise(async (resolve, reject) => {
  try {
    if (!options._id) return reject({ type: 'system', error: e });
    const data = pick(options);
    const _root = await isRoot(data.group);
    if (_root) return reject({ type: 'system', error: '不能更新系统组用户' });
    await adminUserModel.update({ _id: options._id }, data, { runValidators: true });
    resolve();
  } catch (e) {
    reject({ type: 'database', error: e.message });
  };
});

/**
 * 删除
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.remove = options => new Promise(async (resolve, reject) => {
  try {
    if (!options._id) throw Error('缺少_id');
    const adminUser = await adminUserModel.findById(options._id);
    if (!adminUser) return Error('无此用户');
    const _root = await isRoot(data.group);
    if (_root) return reject({ type: 'system', error: '不能删除系统组用户' });
    await adminUser.remove();
    resolve();
  } catch (e) {
    reject({ type: 'database', error: e.message });
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
    adminUser ? resolve(adminUser) : reject('用户不存在');
  } catch (e) {
    reject({ type: 'database', error: e.message });
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
    reject({ type: 'database', error: e.message });
  };
});