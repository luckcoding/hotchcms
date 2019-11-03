import Koa from 'koa'
import { UserModel } from '../models'
import { FailType } from '../constants'

const TokenFailMsg = '登录信息已过期,请重新登录'
const UserMissMsg = '用户不存在'

export const isUser = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const { user } = ctx.state
    
  if (!user) {
    ctx.fail(TokenFailMsg, FailType.tokenErr)
  }
  
  ctx.userInfo = await UserModel.findById(user._id).lean()

  if (!ctx.userInfo) {
    ctx.fail(UserMissMsg, FailType.flowErr)
  }
  await next()
}

export const isAdmin = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const { user } = ctx.state

  if (!user) {
    ctx.fail(TokenFailMsg, FailType.tokenErr)
  } else {
    await next()
  }
}