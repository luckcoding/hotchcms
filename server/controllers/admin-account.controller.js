const _ = require('lodash');
const jwt = require('jsonwebtoken');
const sha1 = require('../services/sha1.service');
const AdminUser = require('../models/admin-user.model');
const config = require('../config/system.config');

const { expiresInLong, expiresIn, secret } = config;

/**
 * 登陆
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.signIn = async ctx => {
  ctx.checkBody({
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于 6 位'
      }
    },
    'autoSignIn': {
      optional: true,
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    const { email, password, autoSignIn } = ctx.request.body;

    const call = await AdminUser.findOne({ email });

    if (call && sha1(password) === call.password) {

      let expiresIn = autoSignIn ? expiresInLong : expiresIn; // token 时间

      const _id = call._id.toString();
      const token = jwt.sign({ data: _id }, secret, { expiresIn });
      ctx.redis.set(token, _id, 'EX', expiresIn); // 以 token 为key

      ctx.pipeDone(token);
    } else {
      ctx.pipeFail('用户名或密码错误', 'BN99');
    }
  } catch (e) {
    ctx.pipeFail(e);
  }
};

/**
 * 注销
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.signOut = async ctx => {
  try {
    const auth = ctx.request.headers.authorization.split(' ')[1];
    await ctx.redis.del(auth);
    ctx.pipeDone();
  } catch (e) {
    ctx.pipeFail(e);
  }
};

/**
 * 查询当前账号
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.current = async ctx => {
  try {
    const _id = ctx.state.user.data;
    const user = await AdminUser._one(_id);
    ctx.pipeDone(user);
  } catch (e) {
    ctx.pipeFail(e);
  }
};

/**
 * 更新当前账号
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.update = async ctx => {
  ctx.checkBody({
    'nickname': {
      optional: true,
      isString: { errorMessage: 'nickname 需为字符串' }
    },
    'mobile': {
      optional: true,
      isString: { errorMessage: 'mobile 需为字符串' },
      isLength: {
        options: [11,11],
        errorMessage: 'mobile 为11位'
      }
    },
    'password': {
      optional: true,
      isString: { errorMessage: 'password 需为字符串' },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于6位'
      }
    },
    'avatar': {
      optional: true,
      isString: { errorMessage: 'avatar 需为字符串' },
    },
  });

  if (ctx.validationErrors()) return null;

  try {
    const _id = ctx.state.user.data;

    const input = _.pick(ctx.request.body, ['nickname', 'mobile', 'password', 'avatar'])
    if (input.password) input.password = sha1(input.password);

    await AdminUser.update({ _id }, input);
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};
