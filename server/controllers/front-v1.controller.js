const { Article } = require('../models')

/**
 * 查询文章列表
 */
exports.articleList = async (ctx) => {
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
    authorName: {
      optional: true,
      isString: { errorMessage: 'authorName 需为 String' },
    },
    author: {
      optional: true,
      isMongoId: { errIorMessage: 'author 需为 mongoId' },
    },
    isTop: {
      optional: true,
      isBoolean: { errorMessage: 'isTop 需为 Boolean' }
    },
  })

  try {
    const {
      page = 1, pageSize = 10,
      ...query
    } = await ctx.pipeInput()

    if (query.title) query.title = new RegExp(query.title, 'i')
    if (query.authorName) authorName.title = new RegExp(query.authorName, 'i')

    // default query
    query.status = 1

    const total = await Article.count(query)
    const list = await Article.find(query)
      .sort('-create.date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('title createDate subTitle category cover tags author authorName viewNum commentNum original')
      .populate('category', 'name path')
      .populate('author')
      .lean()

    ctx.pipeDone({ list, total, pageSize, page })

  } catch (e) {
    ctx.pipeFail(e)
  }
}

/**
 * 查询文章
 */
exports.articleItem = async (ctx) => {
  ctx.checkParams({
    _id: {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空',
      },
      isShortid: { errorMessage: '_id  需为 shortid' },
    },
  })

  try {
    const { _id } = await ctx.pipeInput()

    const call = await Article.findById(_id)
      .select({})
      .lean()
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
  } catch (e) {
    ctx.pipeFail(e)
  }
}
