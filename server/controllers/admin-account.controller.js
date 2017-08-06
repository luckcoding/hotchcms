const jwt = require('jsonwebtoken');
const sha1 = require('../services/sha1.service');
const adminUserService = require('../services/admin-user.service');
const config = require('../config/system.config');

/**
 * 校验
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.check = async (ctx, next) => {
  try {
    const _id = ctx.state.user.data;
    const auth = ctx.request.headers.authorization.split(' ')[1];
    const reply = await ctx.redis.get(auth);
    reply === _id ? await next() : ctx.pipeFail('BN99', '用户未登录');
  } catch(e) {
    ctx.pipeFail('9999', e.message);
  }
};

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
    // 'captcha': {
    //   notEmpty: {
    //     options: [true],
    //     errorMessage: 'captcha 不能为空'
    //   },
    //   isLength: {
    //     options: [1, 4],
    //     errorMessage: '验证码长度需为 1 到 4 位'
    //   }
    // },
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
      notEmpty: {
        options: [true],
        errorMessage: 'autoSignIn 不能为空'
      },
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    }
  });

  if (ctx.validationErrors()) return null;

  const { email, password, autoSignIn } = ctx.request.body;

  // if (captcha !== ctx.session.captcha) {
  //   return ctx.pipeFail('VD99', '验证码错误');
  // }

  try {
    const adminUser = await adminUserService.one({ email: email, selectPassword: true });
    if (adminUser && sha1(password) === adminUser.password) {

      let expiresIn = autoSignIn ? config.expiresInLong : config.expiresIn; // token 时间

      const _id = adminUser._id.toString();
      const token = jwt.sign({ data: _id }, config.secret, { expiresIn });
      ctx.redis.set(token, _id, 'EX', expiresIn); // 以 token 为key

      ctx.pipeDone(token);
    } else {
      ctx.pipeFail('BN99', '用户名或密码错误');
    }
  } catch (e) {
    ctx.pipeFail('9999', e.message);
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
    ctx.pipeFail('9999', e.message);
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
    const user = await adminUserService.one({ _id });
    ctx.pipeDone(user);
  } catch (e) {
    ctx.pipeFail('9999', e.message);
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
    'group': {
      optional: true,
      isMongoId: { errIorMessage: 'role 需为 mongoId' },
    }
  });

  if (ctx.validationErrors()) return null;

  const _id = ctx.state.user.data;

  if (ctx.request.body.password) {
    ctx.request.body.password = sha1(ctx.request.body.password);
  }

  try {
    await adminUserService.update({ ...ctx.request.body, _id });
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail('9999', e.message);
  }
};
