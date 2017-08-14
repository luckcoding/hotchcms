const _ = require('lodash');
const adminUserModel = require('../models/admin-user.model');
const adminGroupModel = require('../models/admin-group.model');

const userSchema = 'mobile email password nickname avatar group';
const groupSchema = 'name description root authorities';

/**
 * userSchema options
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const pick = options => _.pick(options, userSchema.split(' '));

/**
 * 判断是否是系统用户组
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
const isRoot = async _id => {
  if (!_id) return Promise.resolve();
  const adminGroup = await adminGroupModel.findById({ _id }).select('root').lean();
  return adminGroup.root ? Promise.resolve() : Promise.reject('不能操作此用户');
};

/**
 * 创建
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = pick(options);
    await isRoot(data.group);
    await new adminUserModel(data).save();
    resolve();
  } catch (e) {
    reject(e);
  };
});

/**
 * 更新
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.update = options => new Promise(async (resolve, reject) => {
  try {
    const { _id } = options;
    if (!_id) throw Error('缺少参数 _id');

    const call = await adminUserModel
      .findById(_id)
      .populate('group')
      .lean();

    if (!call) throw Error('无此管理员');
    if (_.has(call, 'group.root')) throw Error('不能操作此用户');

    const data = pick(options);
    await adminUserModel.update({ _id }, data, { runValidators: true });
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
    const { _id } = options;
    if (!_id) throw Error('缺少_id');

    const call = await adminUserModel
      .findById(_id)
      .populate('group');

    if (!call) throw Error('无此管理员');
    if (_.has(call, 'group.root')) throw Error('不能操作此管理员');

    await call.remove();
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

    const call = await adminUserModel
      .findOne(query)
      .select(userSchema)
      .populate('group', groupSchema)
      .lean();

    call ? resolve(call) : reject('无此管理员');
  } catch (e) {
    reject(e);
  };
});

/**
 * 管理员列表
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.list = (options = {}) => new Promise(async (resolve, reject) => {
  try {
    const query = {};
    let page = 1;
    let pageSize = 10;

    if (options.email) query.email = options.email;
    if (options.mobile) query.mobile = options.mobile;
    if (options.nickname) query.nickname = new RegExp(options.nickname, 'i');
    if (options.group) query.group = options.group;
    if (options.page) page = parseInt(options.page);
    if (options.pageSize) pageSize = parseInt(options.pageSize);

    const total = await adminUserModel.count(query);

    const list = await adminUserModel
      .find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(userSchema)
      .populate('group', groupSchema)
      .lean();

    resolve({ list, total, pageSize, page });
  } catch (e) {
    reject(e);
  };
});