import Koa from 'koa'
import { getManager } from 'typeorm'
import { UserEntity } from '../entities'
import { SBError } from '../utils'

declare module 'koa' {
  export interface BaseContext {
    user?: UserEntity,
  }
}

const level = ['root', 'operator', 'user']
type role = 'root' | 'operator' | 'user'

export const isUser = (role: role = 'user') => async (ctx: Koa.Context, next: () => Promise<any>) => {
  const { user } = ctx.state

  if (!user) {
    throw new SBError('TOKEN_FAIL')
  }

  ctx.user = await getManager().findOne(UserEntity, user.id)

  if (!ctx.user) {
    throw new SBError('NOT_EXIST')
  }

  if (level.indexOf(role) < level.indexOf(ctx.user.role || 'user')) {
    throw new SBError('DENIED')
  }

  await next()
}

export const isAdmin = (ctx: Koa.Context, next: () => Promise<any>) => {
  const { user } = ctx.state

  if (!user) {
    throw new SBError('TOKEN_FAIL')
  }

  return next()
}
