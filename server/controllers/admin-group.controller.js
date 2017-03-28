const sha1 = require('../services/sha1.service');
const adminGroupService = require('../services/admin-group.service');

exports.check = async (ctx, next) => {
  ctx.session.adminUserId ? await next() : ctx.pipeFail(400,'用户未登录');
};

exports.one = async ctx => {
  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    }
  });
  
  try {
    const _id = ctx.session.adminUserId;
    if (_id) {
      const user = await adminGroupService.one({ _id: _id });
      ctx.pipeDone(user);
    }

  } catch (e) {
    e.type = 'database';
    ctx.pipeFail(500,'查询失败',e);
  }
};


exports.list = async ctx => {
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