import { Plugins } from './plugins'
import { prop, getModelForClass } from '@typegoose/typegoose'
import { sha1 } from '../utils/crypto'
import * as regx from '../utils/regx'

export class Manager extends Plugins {
  // 账户
  @prop({ unique: true, match: regx.email })
  email?: string

  // 密码
  @prop({ set: sha1, get: val => val })
  password!: string

  // 权限
  @prop({ min: 0, max: 100, default: 0 })
  role: number
}

export const ManagerModel = getModelForClass(Manager)