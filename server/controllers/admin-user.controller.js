const AdminUser = require('../models/admin-user.model')

const { _validator } = AdminUser.schema

/**
 * 创建管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.create = async (ctx) => {
  ctx.checkBody(_validator(['*email', '*password', 'mobile', 'nickname', 'avatar', 'group']))

  if (ctx.validationErrors()) return null

  try {
    await AdminUser.create(ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.update = async (ctx) => {
  ctx.checkBody(_validator(['password', 'mobile', 'nickname', 'avatar', 'group']))

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
    await AdminUser.update({ _id: ctx.params._id }, ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询单个管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
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
    const call = await AdminUser.findById(ctx.params._id)
      .select('email mobile nickname create group')
      .populate('group', 'name description authorities gradation')
      .lean()
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 管理员列表查询
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery(_validator(['email', 'mobile', 'nickname', 'group'], {
    page: {
      optional: true,
      isNumber: { errorMessage: 'page  需为 Number' },
    },
    pageSize: {
      optional: true,
      isNumber: { errorMessage: 'pageSize  需为 Number' },
    },
  }))

  if (ctx.validationErrors()) return null

  try {
    const {
      page = 1, pageSize = 10,
      ...query
    } = ctx.request.query

    if (query.nickname) query.nickname = new RegExp(query.nickname, 'i')

    const total = await AdminUser.count(query)
    const list = await AdminUser.find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('email mobile nickname create group')
      .populate('group', 'name description authorities gradation')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 删除管理员
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
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
    await AdminUser.remove({ _id: ctx.params._id })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
