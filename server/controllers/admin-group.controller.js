const {
  AdminGroup,
  AdminUser,
} = require('../models')

const { _validator } = AdminGroup.schema

/**
 * 创建管理组
 */
exports.create = async (ctx) => {
  ctx.checkBody(_validator(['*name', '*description', 'gradation', 'authorities']))

  if (ctx.validationErrors()) return null

  try {
    await AdminGroup.create(ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新管理组
 */
exports.update = async (ctx) => {
  ctx.checkBody(_validator(['name', 'description', 'gradation', 'authorities']))

  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await AdminGroup.update({ _id: ctx.params._id }, ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询单个管理组
 */
exports.one = async (ctx) => {
  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    const call = await AdminGroup.findById(ctx.params._id)
      .select('name description authorities gradation')
      .lean()
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询管理组列表
 */
exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery(_validator(['name', 'gradation']))

  if (ctx.validationErrors()) return null

  try {
    const {
      page = 1, pageSize = 10,
      ...query
    } = ctx.request.query

    if (query.nickname) query.nickname = new RegExp(query.nickname, 'i')

    const total = await AdminGroup.count(query)
    const list = await AdminGroup.find(query)
      .sort('-gradation')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('name description authorities gradation')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 删除管理组
 */
exports.delete = async (ctx) => {
  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await AdminGroup.remove({ _id: ctx.params._id })
    await AdminUser.update({ group: ctx.params._id }, { $unset: { group: true } })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.multi = async (ctx) => {
  ctx.checkBody({
    type: {
      notEmpty: {
        options: [true],
        errorMessage: 'type 不能为空',
      },
      isIn: {
        options: [['remove', 'add', 'update']],
        errorMessage: 'type 必须为 remove/add/update',
      },
    },
    multi: {
      optional: true,
      inArray: {
        options: ['isMongoId'],
        errorMessage: 'multi 内需为 mongoId',
      },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    const { multi, type } = ctx.request.body
    if (type === 'remove') {
      await AdminGroup.remove({ _id: { $in: multi } })
      ctx.pipeDone()
    } else {
      ctx.pipeFail(`暂无${type}操作`, 'BN99')
    }
  } catch (e) {
    ctx.pipeFail(e)
  }
}
