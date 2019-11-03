import { prop, arrayProp, Ref, getModelForClass } from '@typegoose/typegoose'
import { Plugins } from './plugins'

/**
 * 文章分类
 */
export class Category extends Plugins {
  // 分类名
  @prop({ required: true })
  name!: string

  // 目录
  @prop({ required: true, unique: true, lowercase: true, match:  /^[A-z]+$/, minlength: 4 })
  path!: string

  // 是否在导航中显示
  @prop({ default: false })
  state: boolean

  // 排序
  @prop({ unique: true, default: 0 })
  sort?: number

  // 关键字
  @arrayProp({ items: String })
  keywords: string[]

  // 描述
  @prop()
  description: string
}