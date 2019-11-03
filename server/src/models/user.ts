import { Plugins } from './plugins'
import { prop, getModelForClass } from '@typegoose/typegoose'
import { sha1 } from '../utils/crypto'
import * as regx from '../utils/regx'

export class User extends Plugins {
  // 账户
  @prop({ unique: true, sparse: true, minlength: 5, maxlength: 20 })
  account?: string

  // 微信unionid
  @prop({ unique: true, sparse: true })
  wxId?: string

  // 手机
  @prop({ unique: true, sparse: true, match: regx.phone, })
  phone?: string

  // 邮箱
  @prop({ unique: true, trim: true, sparse: true, match: regx.email })
  email?: string

  // 密码
  @prop({ set: sha1, get: val => val })
  password!: string

  // 昵称
  @prop({ minlength: 2, maxlength: 16 })
  nickname?: string

  // 个性签名
  @prop({ maxlength: 50 })
  intro?: string

  // 头像
  @prop()
  avatar?: string
}

export const UserModel = getModelForClass(User)