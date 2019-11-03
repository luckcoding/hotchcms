import { Plugins } from './plugins'
import { prop, arrayProp, Ref, getModelForClass } from '@typegoose/typegoose'
import { Category } from './category'
import { User } from './user'

/**
 * 文章内容
 */
export class Article extends Plugins {
  @prop()
  title?: string // 标题

  @prop()
  overview?: string // 概述
  
  @prop({ ref: Category, type: String })
  category?: Ref<Category, string> //  分类

  @prop()
  cover?: string // 封面

  @arrayProp({ items: String })
  tags: string[] // 标签

  @prop()
  content?: string // 内容，存储 html 字符串，不再存储json格式

  @prop({ default: 0 })
  sourceType: number // 来源类型 0: 转载, 1: 编辑(adminUser), 2: 用户(User)

  @prop({ ref: User, type: String })
  author?: Ref<User, string> // 作者ID, 系统内部作者才有

  @prop()
  originalAuthor?: string // 原作者名字，用于转载等场景

  @prop()
  originalUrl?: string // 转载地址

  @prop({ default: false })
  isTop: boolean // 是否置顶

  @prop({ default: false })
  viewNum: number // 浏览数量

  @arrayProp({ itemsRef: User, type: String })
  liked: Ref<User, string>[] // 喜欢该文章的用户ID集合

  @prop({ default: 0 })
  status: number // 0:草稿 1:上线 2:下线 9:回收站
}

export const ArticleModel = getModelForClass(Article)