const sha1 = require('../services/sha1.service');
const AdminUser = require('../models/admin-user.model');

/**
 * 创建管理员
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
        options: [2,20],
        errorMessage: 'nickname 为 2-20 位'
      }
    },
    'avatar': {
      optional: true,
      isString: { errorMessage: 'avatar 需为字符串' },
    },
    'group': {
      optional: true,
      isMongoId: { errIorMessage: 'group 需为 mongoId' },
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await AdminUser.create(ctx.request.body);
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 更新管理员
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
    await AdminUser.update({ _id: ctx.params._id }, ctx.request.body);
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 查询单个管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
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
    const call = await AdminUser.findById(ctx.params._id)
      .select('email mobile nickname create group')
      .populate('group', 'name description authorities gradation')
      .lean();
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99');
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 管理员列表查询
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.list = async ctx => {
  ctx.sanitizeQuery('page').toInt();
  ctx.sanitizeQuery('pageSize').toInt();
  ctx.checkQuery({
    'page': {
      optional: true,
      isNumber: { errorMessage: 'page  需为 Number' }
    },
    'pageSize': {
      optional: true,
      isNumber: { errorMessage: 'pageSize  需为 Number' }
    },
    'email': {
      optional: true,
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    'mobile': {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' }
    },
    'nickname': {
      optional: true,
      isString: { errorMessage: 'nickname  需为 String' }
    },
    'group': {
      optional: true,
      isMongoId: { errorMessage: 'group  需为 mongoId' }
    },
  });
  try {
    const {
      page = 1, pageSize = 10,
      ...query
    } = ctx.request.query;

    if (query.nickname) query.nickname = new RegExp(query.nickname, 'i');

    const total = await AdminUser.count(query);
    const list = await AdminUser.find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('email mobile nickname create group')
      .populate('group', 'name description authorities gradation')
      .lean();

    ctx.pipeDone({ list, total, pageSize, page });
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 删除管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
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
    await AdminUser.remove({ _id: ctx.params._id });
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};
