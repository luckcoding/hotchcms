import Joi from 'joi'
import * as validate from './validate'
import * as constants from '../constants'

export const isId = Joi.string().custom(value => {
  if (!validate.isId(value)) {
    throw new TypeError('not id')
  }
  return value
}).description('ID')

export const isPath = Joi.string().custom(value => {
  if (!validate.isPath(value)) {
    throw new TypeError('not path')
  }
  return value
}).description('path')

export const joiSchema = {
  // common - base
  id: isId,
  page: Joi.number().optional().default(1).description('页码'),
  pageSize: Joi.number().optional().default(10).description('每页数量'),
  email: Joi.string().email().optional().description('邮箱'),
  account: Joi.string().optional().description('账号'),
  phone: Joi.string().custom(value => {
    if (!validate.isPhone(value)) {
      throw new TypeError('no a phone number')
    }
    return value
  }).description('手机号'),
  password: Joi.string().optional().description('密码'),
  address: Joi.string().optional().description('地址'),
  nickname: Joi.string().optional().description('昵称'),
  avatar: Joi.string().optional().description('头像'),
  roleType: Joi.string().valid(...constants.RoleTypes).optional().description('角色'),
  codeType: Joi.string().valid(...constants.CodeTypes).optional().description('验证码类型'),

  category: {
    name: Joi.string().optional().description('名称'),
    sort: Joi.number().optional().default(0).description('排序'),
    path: isPath,
    display: Joi.boolean().optional().default(false).description('是否在导航中显示'),
    keywords: Joi.array().items(Joi.string()).optional().description('关键词'),
    description: Joi.string().optional().description('描述'),
  },

  article: {
    title: Joi.string().optional().description('标题'),
    overview: Joi.string().optional().description('简介'),
    cover: Joi.string().optional().description('封面'),
    tags: Joi.array().items(Joi.string()).optional().description('标签'),
    content: Joi.string().optional().description('内容'),
    from: Joi.string().valid(...constants.ArticleFromTypes).optional().description('文章来源'),
    originalAuthor: Joi.string().optional().description('原作者'),
    originalUrl: Joi.string().optional().description('转载地址'),
    isTop: Joi.boolean().optional().description('是否置顶'),
    status: Joi.string().valid(...constants.ArticleStatusTypes).optional().description('状态'),
  },
}

export { Joi }
