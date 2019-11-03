
import { BaseContext } from 'koa'
import { ArticleModel } from '../models'
import Utils from './_utils'
import { Group, Request, Query, Params, Body, Summary } from '../utils/decorator'


@Group('文章')
export default class Article extends Utils {
  @Request('POST', '/article')
  @Summary('创建只做生成文章ID功能')
  async create(ctx: BaseContext) {
    ctx.done(await ArticleModel.create({}))
  }

  @Request('PUT', '/article/:_id')
  @Body({
    title: { optional: true, isString: true },
    overview: { optional: true, isString: true },
    category: { optional: true, isId: true },
    cover: { optional: true, isString: true },
    tags: { optional: true, inArray: { options: ['isString'] } },
    content: { optional: true, isString: true },
    originalAuthor: { optional: true, isString: true },
    originalUrl: { optional: true, isString: true },
    status: { optional: true, isIn: { options: [[0, 1, 2, 9]] } }
  })
  @Params({
    _id: { notEmpty: true, isId: true }
  })
  @Summary('更新文章')
  async update(ctx: BaseContext) {
    const { _id, originalAuthor, ...docs } = await ctx.payload()

    let extendsData: any = {}
    
    // if (originalAuthor) {
    //   extendsData.originalAuthor = originalAuthor
    //   extendsData.$unset = { author: true }
    // } else {
    //   extendsData.author = ctx.state.user._id
    //   extendsData.$unset = { originalAuthor: true }
    // }

    await ArticleModel.findByIdAndUpdate(_id, { ...docs, ...extendsData })
    ctx.done()
  }

  @Request('GET', '/article/:_id')
  @Params({
    _id: { notEmpty: true, isId: true }
  })
  @Summary('查询单个文章')
  async one(ctx: BaseContext) {
    ctx.done(await ArticleModel.findOne(await ctx.payload()).lean())
  }

  @Request('GET', '/article/')
  @Query({
    title: { optional: true, isString: true },
    category: { optional: true, isId: true },
    authorName: { optional: true, isString: true },
    author: { optional: true, isId: true },
    isTop: { optional: true, isBoolean: true },
    original: { optional: true, isBoolean: true },
    from: { optional: true, isString: true },
    status: { optional: true, isIn: { options: [[0, 1, 2, 9]] } },
    page: { optional: true, isNumber: true },
    pageSize: { optional: true, isNumber: true },
  })
  @Summary('查询文章列表')
  async list(ctx: BaseContext) {
    const { page, pageSize, ...query } = await ctx.payload()
    ctx.done(await ArticleModel.paginate(query, {
      page,
      pageSize
    }))
  }

  @Request('DELETE', '/article/:_id')
  @Params({
    _id: { notEmpty: true, isId: true }
  })
  @Summary('删除文章')
  async delete(ctx: BaseContext) {
    const { _id } = await ctx.payload()
    ctx.done(await ArticleModel.findByIdAndRemove(_id))
  }
}

// exports.multi = async (ctx) => {
//   ctx.checkBody({
//     type: {
//       notEmpty: {
//         options: [true],
//         errorMessage: 'type 不能为空',
//       },
//       isIn: {
//         options: [['remove', 'add', 'update']],
//         errorMessage: 'type 必须为 remove/add/update',
//       },
//     },
//     multi: {
//       optional: true,
//       inArray: {
//         options: ['isShortid'],
//         errorMessage: 'multi 内需为 shortid',
//       },
//     },
//   })

//   try {
//     const { multi, type } = await ctx.pipeInput()
//     if (type === 'remove') {
//       // 只物理删除回收站 => status === 9
//       const toTrash = []
//       const toRemove = []
//       const call = await Article.find({ _id: { $in: multi } })
//       if (Array.isArray(call)) {
//         call.forEach((item) => {
//           item.status === 9 ? toRemove.push(item._id) : toTrash.push(item._id)
//         })
//       }

//       if (toTrash.length) {
//         await Article.update({ _id: { $in: toTrash } }, { status: 9 })
//       }

//       if (toRemove.length) {
//         await Article.remove({ _id: { $in: toRemove } })
//       }

//       ctx.pipeDone()
//     } else {
//       ctx.pipeFail(`暂无${type}操作`, 'BN99')
//     }
//   } catch (e) {
//     ctx.pipeFail(e)
//   }
// }

// /**
//  * ===================================================
//  * front api
//  */

// /**
//  * 查询文章列表
//  */
// exports.articleList = async (ctx) => {
//   ctx.sanitizeQuery('page').toInt()
//   ctx.sanitizeQuery('pageSize').toInt()
//   ctx.checkQuery({
//     title: {
//       optional: true,
//       isString: { errorMessage: 'title 需为 String' },
//     },
//     category: {
//       optional: true,
//       isMongoId: { errIorMessage: 'category 需为 mongoId' },
//     },
//     authorName: {
//       optional: true,
//       isString: { errorMessage: 'authorName 需为 String' },
//     },
//     author: {
//       optional: true,
//       isMongoId: { errIorMessage: 'author 需为 mongoId' },
//     },
//     isTop: {
//       optional: true,
//       isBoolean: { errorMessage: 'isTop 需为 Boolean' },
//     },
//   })

//   try {
//     const { page = 1, pageSize = 10, ...query } = await ctx.pipeInput()

//     if (query.title) query.title = new RegExp(query.title, 'i')
//     if (query.authorName) query.authorName = new RegExp(query.authorName, 'i')

//     // default query
//     query.status = 1

//     const total = await Article.count(query)
//     const list = await Article.find(query)
//       .sort('-create.date')
//       .skip((page - 1) * pageSize)
//       .limit(pageSize)
//       .select('-content -commentId -likes')
//       .populate('category', 'name path')
//       .populate('author')
//       .lean()

//     ctx.pipeDone({
//       list,
//       total,
//       pageSize,
//       page,
//     })
//   } catch (e) {
//     ctx.pipeFail(e)
//   }
// }

// /**
//  * 查询文章
//  */
// exports.articleItem = async (ctx) => {
//   ctx.checkParams({
//     _id: {
//       notEmpty: {
//         options: [true],
//         errorMessage: '_id 不能为空',
//       },
//       isShortid: { errorMessage: '_id  需为 shortid' },
//     },
//   })

//   try {
//     const { _id } = await ctx.pipeInput()

//     const call = await Article.findById(_id)
//       .select({})
//       .lean()
//     call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99')
//   } catch (e) {
//     ctx.pipeFail(e)
//   }
// }
