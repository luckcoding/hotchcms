const _ = require('lodash');
const logger = require('../lib/logger.lib');
const usersModel = require('../models/users.model');
// const rolesModel = require('../models/roles.model');

/**
 * 用户列表
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.list = options => new Promise(async (resolve, reject) => {
  let query = {};
  if (options.type) query.type = options.type;
  try {
    const users = await usersModel
      .find(query)
      .select('type nickname email role')
      .populate('role', 'name description authorities') // 同时返回权限关系
      .lean() //所以如果对大文档是只读的查询，最好在查询时设置 lean。
      .exec();
    resolve(users);
  } catch (e) {
    e.type = 'database';
    reject(e);
  };
});

/**
 * 查询用户
 * @param {Object} options
 *        {String} options.email
 *        {MongoId} options._id
 *        {Boolean} options.selectPassword
 * @param callback
 */
exports.one = options => new Promise(async (resolve, reject) => {
  let selectPassword = options.selectPassword || false;

  let query = {};

  if (options.email) query.email = options.email;
  if (options._id) query._id = options._id;
  try {
    const user = await usersModel.findOne(query)
      .select('type nickname email password role')
      .populate('role', 'name description authorities')
      .lean();
    if (!user) return resolve();
    if (!selectPassword) delete user.password;
    resolve(user);
  } catch (e) {
    e.type = 'database'
    reject(e);
  };
})

/**
 * 存储用户
 * @param {Object} options
 *        {MongoId} options._id
 *        {Object} options.data
 * @param {Function} callback
 */
exports.save = options => new Promise(async (resolve, reject) => {
  if (!options.data && !_.get(options, 'data.role')) {
    return callback({ type: 'system', error: '没有传入 data 或 role' });
  };

  let _id = options._id;
  let data = options.data;
  try {
    // const role = await rolesModel.findById(data.role).lean().exec();
    let role;
    if (!role) return reject({ type: 'system', error: '没有找到role' });
    if (_.find(role.authorities, authory => authory === 100000)) {
      return reject({ type: 'system', error: '不允许创建权限存在 100000 的用户' })
    };
    if (_id) {
      const user = await usersModel.findById(_id).populate('role').exec();
      if (_.find(_.get(user, 'role.authorities'), authory => authory === 100000)) {
        return reject({ type: 'system', error: '不允许更新权限存在 100000 的用户' })
      };
      await usersModel.update({ _id: _id }, data, {runValidators: true});
      resolve()
    } else {
      const user = await new usersModel(data).save();
      resolve(user);
    };
  } catch (e) {
    e.type = "database";
    reject(e);
  };
});

/**
 * 删除用户
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.remove = options => new Promise(async (resolve, reject) => {
  if (!options._id) return reject({ type: 'system', error: '没有传入 _id' });
  const _id = options._id;
  try {
    const user = await usersModel.findById(_id).populate('role').exec();
    if (_.find(_.get(user, 'role.authorities'), authory => authory === 100000)) {
      return reject({ type: 'system', error: '不允许删除权限存在 100000 的用户' })
    };
    await user.remove();
    resolve();
  } catch (e) {
    e.type = "database";
    reject(e);
  };
});

/**
 * 用户总数
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.total = options => new Promise(async (resolve, reject) => {
  if (!options.type) return reject({ type: 'system', error: '没有传入 type' });
  const type = options.type;
  try {
    const count = await usersModel.count({ type: options.type });
    resolve(count);
  } catch (e) {
    e.type = "database";
    reject(e);
  };
});
