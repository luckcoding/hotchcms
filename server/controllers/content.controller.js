const { Content } = require('../models')

exports.create = async (ctx) => {
  try {
    const call = await Content.create({})
    ctx.pipeDone(call)
  } catch (e) {
    ctx.pipeFail(e)
  }
}

exports.update = async (ctx) => {
  ctx.checkBody({
    title: {
      notEmpty: {
        options: [true],
        errorMessage: 'title 不能为空'
      },
      isString: { errorMessage: 'title 需为 String' },
    },
    subtitle: {
      optional: true,
      isString: { errorMessage: 'subtitle 需为 String' },
    },
    category: {
      optional: true,
      isMongoId: { errIorMessage: 'category 需为 mongoId' },
    },
    cover: {
      optional: true,
      isString: { errorMessage: 'cover 需为 String' },
    },
    tags: {
      optional: true,
      inArray: {
        options: ['isString'],
        errorMessage: 'tags 内需为 string'
      },
    },
    isTop: {
      optional: true,
      isBoolean: { errorMessage: 'isTop 需为 Boolean' }
    },
    original: {
      optional: true,
      isBoolean: { errorMessage: 'original 需为 Boolean' }
    },
    from: {
      optional: true,
      isString: { errorMessage: 'cover 需为 String' },
    },
    status: {
      optional: true,
      isIn: {
        options: [[0, 1, 2]],
        errorMessage: 'type 必须为 0/1/2',
      },
    },
    content: {
      notEmpty: {
        options: [true],
        errorMessage: 'content 不能为空',
      },
      isJson: { errorMessage: 'content  需为 Json' },
    },
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

    await Content.update({ _id }, input)
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

  try {
    const { _id } = await ctx.pipeInput()

    const call = await Content.findById(_id)
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
  ctx.checkQuery({
    title: {
      optional: true,
      isString: { errorMessage: 'title 需为 String' },
    },
    category: {
      optional: true,
      isMongoId: { errIorMessage: 'category 需为 mongoId' },
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

    const {
      page = 1, pageSize = 10,
      ...query
    } = await ctx.pipeInput()

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

  try {
    const { _id } = await ctx.pipeInput()

    await Content.remove({ _id })
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

  try {
    const { multi, type } = await ctx.pipeInput()
    if (type === 'remove') {
      await Content._remove(multi)
      ctx.pipeDone()
    } else {
      ctx.pipeFail(`暂无${type}操作`, 'BN99')
    }
  } catch (e) {
    ctx.pipeFail(e)
  }
}
