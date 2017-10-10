const Content = require('../models/content.model')

const { _validator } = Content.schema

exports.create = async (ctx) => {
  ctx.checkBody(_validator([
    '*title', 'subtitle', 'category', 'cover', 'tags',
    'keywords', 'description', 'isTop', 'from',
  ]), {
    content: {
      notEmpty: {
        options: [true],
        errorMessage: 'content 不能为空',
      },
      isJson: { errorMessage: 'content  需为 Json' },
    },
  })

  if (ctx.validationErrors()) return null

  try {
    await Content.create(ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.update = async (ctx) => {
  ctx.checkBody(_validator(['password', 'nickname', 'avatar', 'group']))

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
    await Content.update({ _id: ctx.params._id }, ctx.request.body)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

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
    const call = await Content.findById(ctx.params._id)
      .select({})
      .lean()
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery(_validator(['title', 'category'], {
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

    if (query.title) query.title = new RegExp(query.title, 'i')

    const total = await Content.count(query)
    const list = await Content.find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select({})
      .populate('category', 'name path')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

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
    await Content.remove({ _id: ctx.params._id })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
