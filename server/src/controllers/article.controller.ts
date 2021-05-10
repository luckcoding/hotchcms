
import { BaseContext } from 'koa'
import { Summary, Tag, request, check } from '@koa-lite/controller'
import { Joi, joiSchema } from '../utils'
import { ArticleService } from '../services'

@Tag('文章')
export class Article {
  @request.post('/article')
  @Summary('创建只做生成文章ID功能')
  async create(ctx: BaseContext) {
    ctx.done(await ArticleService.create({}))
  }

  @request.put('/article/:_id')
  @check.body(Joi.object({
    title: joiSchema.article.title,
    overview: joiSchema.article.overview,
    category: joiSchema.id,
    cover: joiSchema.article.cover,
    tags: joiSchema.article.tags,
    content: joiSchema.article.content,
    originalAuthor: joiSchema.article.originalAuthor,
    originalUrl: joiSchema.article.originalUrl,
    isTop: joiSchema.article.isTop,
    status: joiSchema.article.status,
  }))
  @check.params(Joi.object({
    _id: joiSchema.id.required(),
  }))
  @Summary('更新文章')
  async update(ctx: BaseContext) {
    const { _id, ...dto } = ctx.payload()
    // @todo
    // if (dto.originalAuthor) {
    //   dto.author = null
    // }
    ctx.done(await ArticleService.update(_id, dto))
  }

  @request.get('/article/:_id')
  @check.params(Joi.object({
    _id: joiSchema.id.required(),
  }))
  @Summary('查询单个文章')
  async one(ctx: BaseContext) {
    const { _id } = ctx.payload()
    ctx.done(await ArticleService.findById(_id))
  }

  @request.get('/article')
  @check.query(Joi.object({
    // page
    page: joiSchema.page,
    pageSize: joiSchema.pageSize,
    // info
    title: joiSchema.article.title,
    overview: joiSchema.article.overview,
    category: joiSchema.id,
    tags: joiSchema.article.tags,
    content: joiSchema.article.content,
    isTop: joiSchema.article.isTop,
    status: joiSchema.article.status,
  }))
  @Summary('查询文章列表')
  async list(ctx: BaseContext) {
    ctx.done(await ArticleService.findAll(ctx.payload()))
  }

  @request.del('/article/:_id')
  @check.params(Joi.object({
    _id: joiSchema.id.required(),
  }))
  @Summary('删除文章')
  async delete(ctx: BaseContext) {
    const { _id } = ctx.payload()
    ctx.done(await ArticleService.delete(_id))
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
