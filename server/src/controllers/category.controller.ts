import { BaseContext } from 'koa'
import { CategoryService } from '../services'
import { isUser } from '../middlewares/auth'
import { Summary, Tag, request, Middle, check } from '@koa-lite/controller'
import { Joi, joiSchema } from '../utils/joi'

@Tag('文章分类')
export default class CategoryController {
  @request.get('/categories')
  @Summary('文章分类')
  async list (ctx: BaseContext) {
    ctx.done(await CategoryService.findAll(ctx.payload()))
  }

  @request.post('/category')
  @check.body(Joi.object({
    name: joiSchema.category.name.required(),
    path: joiSchema.category.path.required(),
    sort: joiSchema.category.sort,
    display: joiSchema.category.display,
    keywords: joiSchema.category.keywords,
    description: joiSchema.category.description,
  }))
  @Summary('创建分类')
  @Middle([ isUser('operator') ])
  async create (ctx: BaseContext) {
    ctx.done(await CategoryService.create(ctx.payload()))
  }

  @request.put('/category/:id')
  @check.params(Joi.object({
    id: joiSchema.id.required(),
  }))
  @check.body(Joi.object({
    name: joiSchema.category.name,
    path: joiSchema.category.path,
    sort: joiSchema.category.sort,
    display: joiSchema.category.display,
    keywords: joiSchema.category.keywords,
    description: joiSchema.category.description,
  }))
  @Summary('更新分类')
  @Middle([ isUser('operator') ])
  async update (ctx: BaseContext) {
    const { id, ...dto } = ctx.payload()
    ctx.done(await CategoryService.update(id, dto))
  }

  @request.del('/category/:id')
  @check.params(Joi.object({
    id: joiSchema.id.required(),
  }))
  @Summary('删除分类')
  @Middle([ isUser('operator') ])
  async delete (ctx: BaseContext) {
    const { id } = ctx.payload()
    ctx.done(await CategoryService.delete(id))
  }
}

/**
 * 多选操作
 */
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
//         options: ['isMongoId'],
//         errorMessage: 'multi 内需为 mongoId',
//       },
//     },
//   })

//   try {
//     const { multi, type } = await ctx.pipeInput()

//     if (type === 'remove') {
//       await Category._remove(multi)
//       ctx.pipeDone()
//     } else {
//       ctx.pipeFail(`暂无${type}操作`, 'BN99')
//     }
//   } catch (e) {
//     ctx.pipeFail(e)
//   }
// }
