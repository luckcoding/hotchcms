const contentCategoryService = require('../services/content-category.service');

const categorySchema = 'name path state sort keywords description';

exports.create = async ctx => {
  ctx.checkBody({
    'uid': {
      optional: true,
      isMongoId: { errIorMessage: 'role 需为 mongoId' },
    },
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' },
    },
    'path': {
      notEmpty: {
        options: [true],
        errorMessage: 'path 不能为空'
      },
      isString: { errorMessage: 'path 需为字符串' },
    },
    'state': {
      optional: true,
      isBoolean: { errorMessage: 'state 需为布尔值' }
    },
    'sort': {
      optional: true,
      isNumber: { errorMessage: 'sort 为数字' }
    },
    'keywords': {
      optional: true,
      isString: { errorMessage: 'keywords 需为字符串' },
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为字符串' },
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await contentCategoryService.create(ctx.request.body)
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

exports.update = async ctx => {
  ctx.checkBody({
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' },
    },
    'path': {
      notEmpty: {
        options: [true],
        errorMessage: 'path 不能为空'
      },
      isString: { errorMessage: 'path 需为字符串' },
    },
    'state': {
      optional: true,
      isBoolean: { errorMessage: 'state 需为布尔值' }
    },
    'sort': {
      optional: true,
      isNumber: { errorMessage: 'sort 为数字' }
    },
    'keywords': {
      optional: true,
      isString: { errorMessage: 'keywords 需为字符串' },
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为字符串' },
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
    await contentCategoryService.one(query);
    await contentCategoryService.update(query);
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
    const contentCategory = await contentCategoryService.one(ctx.params);
    ctx.pipeDone(contentCategory);
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};

exports.list = async ctx => {
  try {
    const contentCategories = await contentCategoryService.list();
    ctx.pipeDone(contentCategories);
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
    await contentCategoryService.remove(ctx.params);
    ctx.pipeDone()
  } catch(e) {
    ctx.pipeFail('9999', e);
  }
};