const sha1 = require('../services/sha1.service');
const adminUserService = require('../services/admin-user.service');

/**
 * 创建用户
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.create = async ctx => {
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
    'mobile': {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' }
    },
    'nickname': {
      optional: true,
      isString: { errorMessage: 'nickname 需为字符串' },
      isLength: {
        options: [4,20],
        errorMessage: 'mobile 为 4-20 位'
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

  ctx.request.body.password = sha1(ctx.request.body.password);

  try {
    await adminUserService.create(ctx.request.body)
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

/**
 * 更新用户
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.update = async ctx => {
  console.log(ctx.request.body)
  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    },
  })
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

  if (ctx.request.body.password) {
    ctx.request.body.password = sha1(ctx.request.body.password);
  }

  try {
    const adminUser = await adminUserService.one(ctx.params);
    const query = Object.assign(ctx.request.body, ctx.params);
    await adminUserService.update(query);
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
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

  if (ctx.validationErrors()) return null;

  try {
    const adminUser = await adminUserService.one(ctx.params);
    ctx.pipeDone(adminUser);
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

exports.list = async ctx => {
  try {
    const adminUsers = await adminUserService.list();
    ctx.pipeDone(adminUsers);
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

exports.delete = async ctx => {
  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await adminUserService.remove(ctx.params);
    ctx.pipeDone()
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};
