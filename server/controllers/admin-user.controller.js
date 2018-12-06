const regx = require('../lib/regx.lib')
const { AdminGroup, AdminUser } = require('../models')

/**
 * 创建管理员
 */
exports.create = async (ctx) => {
  ctx.checkBody({
    email: {
      notEmpty: {
        options: [true],
        errorMessage: 'email 不能为空'
      },
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    password: {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
    },
    mobile: {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' }
    },
    nickname: {
      optional: true,
      isString: { errorMessage: 'nickname 需为字符串' },
      isLength: {
        options: [2,20],
        errorMessage: 'nickname 为 2-20 位'
      }
    },
    avatar: {
      optional: true,
      isString: { errorMessage: 'avatar 需为字符串' },
    },
    group: {
      optional: true,
      isMongoId: { errIorMessage: 'group 需为 mongoId' },
    }
  })

  try {
    const input = await ctx.pipeInput()

    // 判断数据的操作权限
    await ctx.checkGradation(input.group)

    await AdminUser.create(input)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 更新管理员
 */
exports.update = async (ctx) => {
  ctx.checkBody({
    nickname: {
      optional: true,
      isString: { errorMessage: 'nickname 需为字符串' },
    },
    mobile: {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' },
    },
    password: {
      optional: true,
      isString: { errorMessage: 'password 需为字符串' },
    },
    avatar: {
      optional: true,
      isString: { errorMessage: 'avatar 需为字符串' },
    },
    group: {
      optional: true,
      isMongoId: { errIorMessage: 'role 需为 mongoId' },
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

    const call = await AdminUser.findById(_id).populate('group')
    // 判断对用户的操作权限
    if (call.group) {
      await ctx.checkGradation(call.group.gradation)
    }

    // 判断对用户组的操作权限
    await ctx.checkGradation(input.group)

    await call.update(input)
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询单个管理员
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

    const call = await AdminUser.findById(_id)
      .select()
      .populate('group', 'name description authorities gradation')
      .lean()
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 管理员列表查询
 */
exports.list = async (ctx) => {
  ctx.sanitizeQuery('page').toInt()
  ctx.sanitizeQuery('pageSize').toInt()
  ctx.checkQuery({
    email: {
      optional: true,
      isEmail: { errorMessage: 'email 格式不正确' }
    },
    mobile: {
      optional: true,
      isMobile: { errorMessage: 'mobile 格式不正确' }
    },
    nickname: {
      optional: true,
      isString: { errorMessage: 'nickname  需为 String' }
    },
    group: {
      optional: true,
      isMongoId: { errorMessage: 'group  需为 mongoId' }
    },
    page: {
      optional: true,
      isNumber: { errorMessage: 'page  需为 Number' },
    },
    pageSize: {
      optional: true,
      isNumber: { errorMessage: 'pageSize  需为 Number' },
    },
  })

  try {
    const { page = 1, pageSize = 10, ...query } = await ctx.pipeInput()

    if (query.nickname) query.nickname = new RegExp(query.nickname, 'i')

    const total = await AdminUser.count(query)
    const list = await AdminUser.find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select()
      .populate('group', 'name')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })
  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 删除管理员
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

    const call = await AdminUser.findById(_id).populate('group')

    // 判断对用户的操作权限
    if (call.group) {
      await ctx.checkGradation(call.group.gradation)
    }

    await call.remove()
    ctx.pipeDone()
  } catch (e) {
    ctx.pipeFail(e)
  }
}