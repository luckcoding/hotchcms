const sha1 = require('../services/sha1.service');
const adminGroupService = require('../services/admin-group.service');
const AdminGroup = require('../models/admin-group.model');

exports.create = async ctx => {
  ctx.checkBody({
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' }
    },
    'description': {
      notEmpty: {
        options: [true],
        errorMessage: 'description 不能为空'
      },
      isString: { errorMessage: 'description 需为字符串' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await adminGroupService.create(ctx.request.body);
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
    // const adminGroup = await adminGroupService.one(ctx.params);
    const adminGroup = await AdminGroup._one(ctx.params._id);
    ctx.pipeDone(adminGroup);
  } catch (e) {
    ctx.pipeFail('9999', e);
  }
};

exports.list = async ctx => {
  ctx.sanitizeQuery('page').toInt();
  ctx.sanitizeQuery('size').toInt();
  try {
    const call = await AdminGroup._list(ctx.query);
    ctx.pipeDone(call);
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

exports.update = async ctx => {
  ctx.checkBody({
    'name': {
      optional: true,
      isString: { errorMessage: 'name 需为字符串' }
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为字符串' }
    },
    'authorities': {
      optional: true,
      isArray: { errorMessage: 'authorities 需为数组' }
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

  const query = Object.assign(ctx.request.body, ctx.params);
  try {
    await adminGroupService.one(query);
    await adminGroupService.update(query);
    ctx.pipeDone();
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
    await adminGroupService.remove(ctx.params);
    ctx.pipeDone()
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};