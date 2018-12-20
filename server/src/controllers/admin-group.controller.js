const lodash = require('lodash')
const {
  AdminGroup,
  AdminUser,
} = require('../models')

/**
 * 创建管理组
 */
exports.create = async (ctx) => {
  ctx.checkBody({
    name: {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为 String' }
    },
    description: {
      notEmpty: {
        options: [true],
        errorMessage: 'description 不能为空'
      },
      isString: { errorMessage: 'description 需为 String' }
    },
    gradation: {
      optional: true,
      isNumber: { errorMessage: 'authorities 需为 Number' }
    },
    authorities: {
      optional: true,
      isArray: { errorMessage: 'authorities 需为 Array' }
    }
  })

  try {
    const input = await ctx.pipeInput()

    await ctx.checkGradation(input.gradation)

    await AdminGroup.create(input)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新管理组
 */
exports.update = async (ctx) => {
  ctx.checkBody({
    name: {
      optional: true,
      isString: { errorMessage: 'name 需为 String' }
    },
    description: {
      optional: true,
      isString: { errorMessage: 'description 需为 String' }
    },
    gradation: {
      optional: true,
      isNumber: { errorMessage: 'authorities 需为 Number' }
    },
    authorities: {
      optional: true,
      isArray: { errorMessage: 'authorities 需为 Array' }
    }
  })

  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' },
    },
  })

  try {
    const { _id, ...input } = await ctx.pipeInput()

    // 判断操作权限
    await ctx.checkGradation(input.gradation)

    const call = await AdminGroup.findById(_id)

    if (!call) return ctx.pipeFail('查询失败', 'BN99')

    // 判断数据的操作权限
    await ctx.checkGradation(call.gradation)

    await call.update(input)
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

  try {
    const { _id } = await ctx.pipeInput()

    const call = await AdminGroup.findById(_id)
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
  ctx.checkQuery({
    name: {
      optional: true,
      isString: { errorMessage: 'name  需为 String' }
    },
    gradation: {
      optional: true,
      isNumber: { errorMessage: 'authorities 需为 Number' }
    },
  })

  try {
    const { page = 1, pageSize = 10, ...query } = await ctx.pipeInput()

    if (query.name) query.name = new RegExp(query.name, 'i')

    const total = await AdminGroup.count(query)
    const list = await AdminGroup.find(query)
      .sort('-gradation')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select()
      // .lean() // 注释，返回虚拟字段 authority

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询可操作
 */
exports.operated = async (ctx) => {
  try {
    const { group } = ctx.state.user
    const list = await AdminGroup.find({ gradation: { $lt: group.gradation } })
      .sort('-gradation')
      .select('name')
      .lean()
    ctx.pipeDone(list)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 所有
 */
exports.all = async (ctx) => {
  try {
    const { group } = ctx.state.user
    const list = await AdminGroup.find({})
      .sort('-gradation')
      .select('name')
      .lean()
    ctx.pipeDone(list)
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

  try {

    const { _id } = await ctx.pipeInput()

    const call = await AdminGroup.findById(_id)

    if (!call) return ctx.pipeFail('查询失败', 'BN99')

    await ctx.checkGradation(call.gradation)

    await call.remove({ _id })
    await AdminUser.update({ group: _id }, { $unset: { group: true } })
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}
