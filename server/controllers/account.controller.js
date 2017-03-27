const logger = require('../lib/logger.lib');
const sha1 = require('../services/sha1.service');
const usersService = require('../services/users.service');
const captcha = require('../lib/captcha.lib');

/**
 * 检查是否登陆
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.check = async (ctx, next) => {
  ctx.session.userId ? await next() : ctx.pipeFail(400,'用户未登录');
};

/**
 * 验证码
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.captcha = ctx => {
  const source = captcha();
  ctx.session.captcha = source.code;
  ctx.pipeDone(source.dataURL);
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
    'captcha': {
      notEmpty: {
        options: [true],
        errorMessage: 'captcha 不能为空'
      },
      isLength: {
        options: [1, 4],
        errorMessage: '验证码长度需为 1 到 4 位'
      }
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
      notEmpty: {
        options: [true],
        errorMessage: 'autoSignIn 不能为空'
      },
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    }
  });

  if (ctx.validationErrors()) return null;

  const { email, password, captcha, autoSignIn } = ctx.request.body;

  if (captcha !== ctx.session.captcha) {
    return ctx.pipeFail(400,'验证码错误')
  };

  try {
    const user = await usersService.one({ email: email, selectPassword: true });
    if (user && sha1(password) === user.password) {
      delete ctx.session.captcha;
      ctx.session.userId = user._id;
      if (autoSignIn) ctx.session.cookie.maxage = 1000 * 60 * 60 * 24;
      ctx.pipeDone();
    } else {
      ctx.pipeFail(500,'用户名或密码错误');
    }
  } catch (e) {
    ctx.pipeFail(500,'登陆失败',e);
  }
};

/**
 * 注销登陆
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.signOut = async ctx => {
  ctx.session = null;
  ctx.pipeDone();
};

/**
 * 查询当前账号
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.current = async ctx => {
  try {
    if (ctx.session.userId) {
      const user = await usersService.one({ _id: ctx.session.userId });
      ctx.pipeDone(user);
    }
  } catch (e) {
    e.type = 'database';
    ctx.pipeFail(500,'查询失败',e);
  }
};

/**
 * 更新账号
 * @param {Object} req
 *        {String} req.body.email
 *        {String} req.body.nickname
 *        {String} req.body.password
 * @param {Function} res
 */
exports.update = async ctx => {
  ctx.checkBody({
    'email': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    'nickname': {
      notEmpty: {
        options: [true],
        errorMessage: 'nickname 不能为空'
      },
      isString: { errorMessage: 'nickname 需为字符串' }
    },
    'password': {
      optional: true,
      isString: { errorMessage: 'password 需为字符串' },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于6位'
      }
    },
    'role': {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      isMongoId: { errIorMessage: 'role 需为 mongoId' },
    }
  });

  if (ctx.validationErrors()) return null;

  var data = {
    nickname: ctx.request.body.nickname,
    email: ctx.request.body.email,
    role: ctx.request.body.role,
  };

  if (ctx.request.body.password) data.password = sha1(ctx.request.body.password);

  try {
    await usersService.save({ _id: ctx.session.userId, data: data })
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(500,'注册失败',e);
  }
};